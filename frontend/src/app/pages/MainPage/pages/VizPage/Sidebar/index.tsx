import {
  FolderAddFilled,
  FundProjectionScreenOutlined,
} from '@ant-design/icons';
import { ListSwitch } from 'app/components';
import useI18NPrefix, { I18NComponentProps } from 'app/hooks/useI18NPrefix';
import classnames from 'classnames';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router';
import styled from 'styled-components/macro';
import { STICKY_LEVEL } from 'styles/StyleConstants';
import { selectStoryboards, selectVizs } from '../slice/selectors';
import { Folder } from '../slice/types';
import { Folders } from './Folders';
import { Storyboards } from './Storyboards';

export const Sidebar = memo(({ i18nPrefix }: I18NComponentProps) => {
  const [selectedKey, setSelectedKey] = useState('folder');
  const vizs = useSelector(selectVizs);
  const storyboards = useSelector(selectStoryboards);
  const matchDetail = useRouteMatch<{ vizId: string }>(
    '/organizations/:orgId/vizs/:vizId',
  );
  const vizId = matchDetail?.params.vizId;
  const t = useI18NPrefix(i18nPrefix);
  const selectedFolderId = useMemo(() => {
    if (vizId && vizs) {
      const viz = vizs.find(({ relId }) => relId === vizId);
      return viz && viz.id;
    }
  }, [vizId, vizs]);

  useEffect(() => {
    if (vizId) {
      const viz =
        vizs.find(({ relId }) => relId === vizId) ||
        storyboards.find(({ id }) => id === vizId);
      if (viz) {
        setSelectedKey((viz as Folder).relType ? 'folder' : 'presentation');
      }
    }
  }, [vizId]); // just switch when vizId changed

  const listTitles = useMemo(
    () => [
      { key: 'folder', icon: <FolderAddFilled />, text: t('folder') },
      {
        key: 'presentation',
        icon: <FundProjectionScreenOutlined />,
        text: t('presentation'),
      },
    ],
    [],
  );

  const switchSelect = useCallback(key => {
    setSelectedKey(key);
  }, []);

  return (
    <Wrapper>
      <ListSwitch
        titles={listTitles}
        selectedKey={selectedKey}
        onSelect={switchSelect}
      />
      <Folders
        selectedId={selectedFolderId}
        i18nPrefix={i18nPrefix}
        className={classnames({ hidden: selectedKey !== 'folder' })}
      />
      <Storyboards
        selectedId={vizId}
        className={classnames({ hidden: selectedKey !== 'presentation' })}
        i18nPrefix={i18nPrefix}
      />
    </Wrapper>
  );
});

const Wrapper = styled.div`
  z-index: ${STICKY_LEVEL + STICKY_LEVEL};
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  min-height: 0;
  background-color: ${p => p.theme.componentBackground};
  box-shadow: ${p => p.theme.shadowSider};

  .hidden {
    display: none;
  }
`;
