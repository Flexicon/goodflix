import { redirect, type ServerLoadEvent } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import type { UserProfile } from '$lib/server';
import type { Session } from '@supabase/supabase-js';

export const load: LayoutServerLoad = async (event) => {
	const session = await event.locals.getSession();
	const shouldRedirectToLogin = buildRedirectToLoginCheck(session, event);
	const shouldRedirectToProfile = buildRedirectToProfileCheck(session, event);

	// If the user is not logged in or currently logging in, redirect them to login page.
	if (shouldRedirectToLogin()) {
		throw redirect(303, '/login');
	}

	// If the user is logged in but not on the profile page, check whether they need to
	// fill out their profile details.
	if (await shouldRedirectToProfile()) {
		throw redirect(303, '/profile?setup');
	}

	return {
		session
	};
};

const buildRedirectToLoginCheck = (session: Session | null, event: ServerLoadEvent) => () =>
	!session && urlIsNoneOf(event.url, '/login', '/logging-in');

const buildRedirectToProfileCheck = (session: Session | null, event: ServerLoadEvent) => async () =>
	!!session &&
	urlIsNoneOf(event.url, '/profile') &&
	isProfileDataMissing(await event.locals.dataStore.userProfile());

const urlIsNoneOf = (url: URL, ...pathsToCheck: string[]): boolean =>
	!pathsToCheck.includes(url.pathname);

const isProfileDataMissing = (profile: UserProfile): boolean => !profile.username;
