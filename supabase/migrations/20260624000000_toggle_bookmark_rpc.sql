CREATE OR REPLACE FUNCTION public.toggle_bookmark(p_post_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_exists  boolean;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT EXISTS(
    SELECT 1 FROM public.bookmarks
    WHERE user_id = v_user_id AND post_id = p_post_id
  ) INTO v_exists;

  IF v_exists THEN
    DELETE FROM public.bookmarks
    WHERE user_id = v_user_id AND post_id = p_post_id;
    RETURN false;
  ELSE
    INSERT INTO public.bookmarks (user_id, post_id)
    VALUES (v_user_id, p_post_id);
    RETURN true;
  END IF;
END;
$$;
