import { FC, SVGProps } from "react";
import s from './Icon.module.scss';

export interface IconProps extends SVGProps<SVGSVGElement> {
  name: string;
};

export const  Icon: FC<IconProps> = ({
  name,
  className,
  ...restProps
}) => {
  const isDecorative = !restProps['aria-label'];

  return (
    <svg
      {...restProps}
      className={`${s.icon} ${className}`}
      focusable="false"
      aria-hidden={isDecorative}
      role={isDecorative ? undefined : 'img'}
    >
      <use
        href={`#icon-${name}`}
        xlinkHref={`#icon-${name}`}
      />
    </svg>
  );
}