import { redirect, type ServerLoadEvent } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import type { Session } from '@supabase/supabase-js';

export const load: LayoutServerLoad = async (event) => {
	const { session } = event.locals;
	const shouldRedirectToProfile = buildRedirectToProfileCheck(session, event);

	// If the user is logged in but not on the profile page, check whether they need to
	// fill out their profile details.
	if (await shouldRedirectToProfile()) {
		return redirect(303, '/profile?setup');
	}

	return {
		session
	};
};

const buildRedirectToProfileCheck = (session: Session | null, event: ServerLoadEvent) => async () =>
	!!session && event.url.pathname !== '/profile' && (await isProfileDataMissing(event));

const isProfileDataMissing = async (event: ServerLoadEvent): Promise<boolean> =>
	event.locals.dataStore.userProfile().then((profile) => !profile.username);
