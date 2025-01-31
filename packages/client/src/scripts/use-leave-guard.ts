import { inject, onUnmounted, Ref } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';
import { i18n } from '@/i18n';
import * as os from '@/os';

export function useLeaveGuard(enabled: Ref<boolean>) {
	const setLeaveGuard = inject('setLeaveGuard');

	if (setLeaveGuard) {
		setLeaveGuard(async () => {
			if (!enabled.value) return false;

			const { canceled } = await os.confirm({
				type: 'warning',
				text: i18n.locale.leaveConfirm,
			});

			return canceled;
		});
	} else {
		onBeforeRouteLeave(async (to, from) => {
			if (!enabled.value) return true;

			const { canceled } = await os.confirm({
				type: 'warning',
				text: i18n.locale.leaveConfirm,
			});

			return !canceled;
		});
	}

	/*
	function onBeforeLeave(ev: BeforeUnloadEvent) {
		if (enabled.value) {
			ev.preventDefault();
			ev.returnValue = '';
		}
	}

	window.addEventListener('beforeunload', onBeforeLeave);
	onUnmounted(() => {
		window.removeEventListener('beforeunload', onBeforeLeave);
	});
	*/
}
