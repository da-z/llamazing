import {
  GridList as AriaGridList,
  GridListItem as AriaGridListItem,
  Button,
  GridListItemProps,
  GridListProps,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import { Checkbox } from "./Checkbox";
import { composeTailwindRenderProps, focusRing } from "./utils";

export function ImageGridList<T extends object>({
  children,
  ...props
}: GridListProps<T>) {
  return (
    <AriaGridList
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "relative overflow-auto rounded-lg border dark:border-zinc-600",
      )}
    >
      {children}
    </AriaGridList>
  );
}

const itemStyles = tv({
  extend: focusRing,
  base: "grid grid-cols-2 gap-2 cursor-default select-none py-2 px-3 text-sm text-gray-900 dark:text-zinc-200 border-y dark:border-y-zinc-700 -outline-offset-2",
  variants: {
    isSelected: {
      false: "hover:bg-gray-100 dark:hover:bg-zinc-700/60",
      true: "bg-blue-100 dark:bg-blue-700/30 hover:bg-blue-200 dark:hover:bg-blue-700/40 border-y-blue-200 dark:border-y-blue-900 z-20",
    },
    isDisabled: {
      true: "text-slate-300 dark:text-zinc-600 forced-colors:text-[GrayText] z-10",
    },
  },
});

export function ImageGridListItem({ children, ...props }: GridListItemProps) {
  const textValue = typeof children === "string" ? children : undefined;
  return (
    <AriaGridListItem
      textValue={textValue}
      {...props}
      className={`relative inline-flex p-2 ${itemStyles}`}
    >
      {({ selectionMode, selectionBehavior, allowsDragging }) => (
        <>
          {/* Add elements for drag and drop and selection. */}
          {allowsDragging && (
            <Button
              slot="drag"
              className="absolute bottom-3 left-3 cursor-grab text-white"
            >
              ≡
            </Button>
          )}
          {selectionMode === "multiple" && selectionBehavior === "toggle" && (
            <Checkbox
              slot="selection"
              className="absolute left-3 top-3 z-10 rounded bg-white/90"
            />
          )}
          {children}
        </>
      )}
    </AriaGridListItem>
  );
}
