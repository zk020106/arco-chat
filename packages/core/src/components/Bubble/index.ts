import type { App } from "vue";
import Bubble from "./Bubble.vue";
import BubbleList from "./BubbleList.vue";

Bubble.install = (app: App) => {
  app.component("Bubble", Bubble);
};

BubbleList.install = (app: App) => {
  app.component("BubbleList", BubbleList);
};

export { Bubble, BubbleList };
export type {
  BubblePropsType,
  BubbleMessage,
  BubbleListProps,
  BubbleVariant,
  BubbleAlign,
  BubbleShape,
  AvatarProps,
  AvatarShape,
  AvatarTriggerType,
  AvatarObjectFit,
} from "./bubble-types";
