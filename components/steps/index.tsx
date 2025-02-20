import CheckOutlined from '@ant-design/icons/CheckOutlined';
import CloseOutlined from '@ant-design/icons/CloseOutlined';
import classNames from 'classnames';
import RcSteps from 'rc-steps';
import type { ProgressDotRender } from 'rc-steps/lib/Steps';
import * as React from 'react';
import Tooltip from '../tooltip';
import { ConfigContext } from '../config-provider';
import useBreakpoint from '../grid/hooks/useBreakpoint';
import Progress from '../progress';
import useLegacyItems from './useLegacyItems';
import useStyle from './style';

export interface StepProps {
  className?: string;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLElement>;
  status?: 'wait' | 'process' | 'finish' | 'error';
  disabled?: boolean;
  title?: React.ReactNode;
  subTitle?: React.ReactNode;
  style?: React.CSSProperties;
}

export interface StepsProps {
  type?: 'default' | 'navigation' | 'inline';
  className?: string;
  current?: number;
  direction?: 'horizontal' | 'vertical';
  iconPrefix?: string;
  initial?: number;
  labelPlacement?: 'horizontal' | 'vertical';
  prefixCls?: string;
  progressDot?: boolean | ProgressDotRender;
  responsive?: boolean;
  size?: 'default' | 'small';
  status?: 'wait' | 'process' | 'finish' | 'error';
  style?: React.CSSProperties;
  percent?: number;
  onChange?: (current: number) => void;
  children?: React.ReactNode;
  items?: StepProps[];
}

interface StepsType extends React.FC<StepsProps> {
  Step: typeof RcSteps.Step;
}

const Steps: StepsType = props => {
  const {
    percent,
    size,
    className,
    direction,
    items,
    responsive = true,
    current = 0,
    children,
    ...restProps
  } = props;
  const { xs } = useBreakpoint(responsive);
  const { getPrefixCls, direction: rtlDirection } = React.useContext(ConfigContext);

  const getDirection = React.useCallback(
    () => (responsive && xs ? 'vertical' : direction),
    [xs, direction],
  );

  const prefixCls = getPrefixCls('steps', props.prefixCls);

  const [wrapSSR, hashId] = useStyle(prefixCls);

  const isInline = props.type === 'inline';
  const iconPrefix = getPrefixCls('', props.iconPrefix);
  const mergedItems = useLegacyItems(items, children);
  const mergedPercent = isInline ? undefined : percent;

  const stepsClassName = classNames(
    {
      [`${prefixCls}-rtl`]: rtlDirection === 'rtl',
      [`${prefixCls}-with-progress`]: mergedPercent !== undefined,
    },
    className,
    hashId,
  );
  const icons = {
    finish: <CheckOutlined className={`${prefixCls}-finish-icon`} />,
    error: <CloseOutlined className={`${prefixCls}-error-icon`} />,
  };

  const stepIconRender = ({
    node,
    status,
  }: {
    node: React.ReactNode;
    index: number;
    status: string;
    title: string | React.ReactNode;
    description: string | React.ReactNode;
  }) => {
    if (status === 'process' && mergedPercent !== undefined) {
      // currently it's hard-coded, since we can't easily read the actually width of icon
      const progressWidth = size === 'small' ? 32 : 40;
      // iconWithProgress
      return (
        <div className={`${prefixCls}-progress-icon`}>
          <Progress
            type="circle"
            percent={mergedPercent}
            width={progressWidth}
            strokeWidth={4}
            format={() => null}
          />
          {node}
        </div>
      );
    }
    return node;
  };

  let itemRender;
  if (isInline) {
    itemRender = (item: StepProps, stepItem: React.ReactNode) =>
      item.description ? <Tooltip title={item.description}>{stepItem}</Tooltip> : stepItem;
  }

  return wrapSSR(
    <RcSteps
      icons={icons}
      {...restProps}
      current={current}
      size={size}
      items={mergedItems}
      itemRender={itemRender}
      direction={getDirection()}
      stepIcon={stepIconRender}
      prefixCls={prefixCls}
      iconPrefix={iconPrefix}
      className={stepsClassName}
    />,
  );
};

Steps.Step = RcSteps.Step;

export default Steps;
