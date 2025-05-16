/*
  # Add trigger for automatic user preferences creation

  1. Changes
    - Add function to create user preferences on profile creation
    - Add trigger to automatically call this function
    
  2. Security
    - Function executes with security definer to ensure proper permissions
*/

CREATE OR REPLACE FUNCTION public.create_user_preferences()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS create_user_preferences_trigger ON public.profiles;

CREATE TRIGGER create_user_preferences_trigger
  AFTER INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.create_user_preferences();