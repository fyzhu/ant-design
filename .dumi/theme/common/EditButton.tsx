import React from 'react';
import { Tooltip } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { css } from '@emotion/react';
import useSiteToken from '../../hooks/useSiteToken';

const branchUrl = 'https://github.com/ant-design/ant-design/edit/master/';

export interface EditButtonProps {
  title: React.ReactNode;
  filename?: string;
}

const useStyle = () => {
  const { token } = useSiteToken();

  const { colorIcon, colorText, iconCls } = token;

  return {
    editButton: css`
      a& {
        display: inline-block;
        text-decoration: none;
        margin-inline-start: 4px;
        vertical-align: -2px;

        ${iconCls} {
          display: block;
          color: ${colorIcon};
          font-size: 16px;
          transition: all 0.3s;

          &:hover {
            color: ${colorText};
          }
        }
      }
    `,
  };
};

export default function EditButton({ title, filename }: EditButtonProps) {
  const styles = useStyle();

  return (
    <Tooltip title={title}>
      <a
        css={styles.editButton}
        href={`${branchUrl}${filename}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <EditOutlined />
      </a>
    </Tooltip>
  );
}
