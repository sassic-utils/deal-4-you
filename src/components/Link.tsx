import type { AnchorHTMLAttributes, MouseEvent } from "react";
import { buildHref, navigate } from "../router";

type LinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  to: string;
};

function isPlainLeftClick(event: MouseEvent<HTMLAnchorElement>) {
  return (
    event.button === 0 &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey
  );
}

function Link({ to, onClick, ...rest }: LinkProps) {
  return (
    <a
      href={buildHref(to)}
      onClick={(event) => {
        onClick?.(event);

        if (event.defaultPrevented || !isPlainLeftClick(event)) {
          return;
        }

        event.preventDefault();
        navigate(to);
      }}
      {...rest}
    />
  );
}

export default Link;
