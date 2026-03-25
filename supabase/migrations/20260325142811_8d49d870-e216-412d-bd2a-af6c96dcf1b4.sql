-- Fix Bug 1: Allow new users to self-assign client role on signup via trigger
CREATE OR REPLACE FUNCTION public.assign_client_role_on_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'client')
  ON CONFLICT (user_id, role) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_assign_role
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.assign_client_role_on_signup();

-- Fix Bug 2: Self-referencing RLS on project_members
DROP POLICY IF EXISTS "Members see project members" ON public.project_members;
CREATE POLICY "Members see project members" ON public.project_members
FOR SELECT TO authenticated
USING (
  (EXISTS (
    SELECT 1 FROM project_members pm2
    WHERE pm2.project_id = project_members.project_id AND pm2.user_id = auth.uid()
  ))
  OR
  (EXISTS (
    SELECT 1 FROM projects p
    WHERE p.id = project_members.project_id AND p.client_id = auth.uid()
  ))
);

-- Fix Bug 3: Self-referencing RLS on messages
DROP POLICY IF EXISTS "Project participants see messages" ON public.messages;
CREATE POLICY "Project participants see messages" ON public.messages
FOR SELECT TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role)
  OR sender_id = auth.uid()
  OR EXISTS (SELECT 1 FROM projects p WHERE p.id = messages.project_id AND p.client_id = auth.uid())
  OR EXISTS (SELECT 1 FROM project_members pm WHERE pm.project_id = messages.project_id AND pm.user_id = auth.uid())
);

-- Fix Bug 4: Self-referencing RLS on project_files
DROP POLICY IF EXISTS "Project participants see files" ON public.project_files;
CREATE POLICY "Project participants see files" ON public.project_files
FOR SELECT TO authenticated
USING (
  has_role(auth.uid(), 'admin'::app_role)
  OR uploaded_by = auth.uid()
  OR EXISTS (SELECT 1 FROM projects p WHERE p.id = project_files.project_id AND p.client_id = auth.uid())
  OR EXISTS (SELECT 1 FROM project_members pm WHERE pm.project_id = project_files.project_id AND pm.user_id = auth.uid())
);

-- Fix Bug 5: Self-referencing RLS on projects (team see assigned)
DROP POLICY IF EXISTS "Team see assigned projects" ON public.projects;
CREATE POLICY "Team see assigned projects" ON public.projects
FOR SELECT TO authenticated
USING (
  EXISTS (SELECT 1 FROM project_members pm WHERE pm.project_id = projects.id AND pm.user_id = auth.uid())
);