import type { TTheme } from "@/types";
import { defineStore } from "pinia";
import { type Ref, ref } from "vue";

export const useNotificationsStore = defineStore("notifications", () => {
  const message: Ref<string> = ref("");
  const visible: Ref<boolean> = ref(false);
  const theme: Ref<TTheme> = ref("primary");
  const duration: Ref<number | null> = ref(4); // duration in seconds 4 by default

  const error = (errorMessage: string, errorStatic: boolean = false) => {
    if (errorStatic) duration.value = null;
    theme.value = "danger";
    message.value = errorMessage;
    visible.value = true;
  };

  const success = (successMessage: string, successStatic: boolean = false) => {
    if (successStatic) duration.value = null;
    theme.value = "success";
    message.value = successMessage;
    visible.value = true;
  };

  const info = (infoMessage: string, infoStatic: boolean = false) => {
    if (infoStatic) duration.value = null;
    theme.value = "info";
    message.value = infoMessage;
    visible.value = true;
  };

  const primary = (primaryMessage: string, primaryStatic: boolean = false) => {
    if (primaryStatic) duration.value = null;
    theme.value = "primary";
    message.value = primaryMessage;
    visible.value = true;
  };

  const warning = (warningMessage: string, warningStatic: boolean = false) => {
    if (warningStatic) duration.value = null;
    theme.value = "warning";
    message.value = warningMessage;
    visible.value = true;
  };

  const hide = () => {
    visible.value = false;
    message.value = "";
  };

  const stick = () => {
    duration.value = null;
  };

  return {
    duration,
    theme,
    message,
    visible,
    error,
    success,
    info,
    primary,
    warning,
    hide,
    stick,
  };
});
