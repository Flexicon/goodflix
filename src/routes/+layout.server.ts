import { redirect, type ServerLoadEvent } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import type { UserProfile } from '$lib/server';
import type { Session, User } from '@supabase/supabase-js';

export const load: LayoutServerLoad = async (event) => {
	const user = await event.locals.getUser();
	const shouldRedirectToLogin = buildRedirectToLoginCheck(user, event);
	const shouldRedirectToProfile = buildRedirectToProfileCheck(user, event);

	// If the user is not logged in or currently logging in, redirect them to login page.
	if (shouldRedirectToLogin()) {
		redirect(303, '/login');
	}

	// If the user is logged in but not on the profile page, check whether they need to
	// fill out their profile details.
	if (await shouldRedirectToProfile()) {
		redirect(303, '/profile?setup');
	}

	return {
		user
	};
};

const buildRedirectToLoginCheck = (user: User | null, event: ServerLoadEvent) => () =>
	!user && urlIsNoneOf(event.url, '/login', '/logging-in');

const buildRedirectToProfileCheck = (user: User | null, event: ServerLoadEvent) => async () =>
	!!user &&
	urlIsNoneOf(event.url, '/profile') &&
	isProfileDataMissing(await event.locals.dataStore.userProfile());

const urlIsNoneOf = (url: URL, ...pathsToCheck: string[]): boolean =>
	!pathsToCheck.includes(url.pathname);

const isProfileDataMissing = (profile: UserProfile): boolean => !profile.username;
