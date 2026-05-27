import { FC, SVGProps } from "react";
import icons from '../../assets/icons/symbol-defs.svg';
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
        href={`${icons}#icon-${name}`}
        xlinkHref={`${icons}#icon-${name}`}
      />
    </svg>
  );
}