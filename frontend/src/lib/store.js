import { readable, writable, derived } from 'svelte/store';

export const logged_in = writable(false);
export const log_in_fail_message = writable(false);
export const current_page = writable(0);
