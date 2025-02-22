import { DatePicker, Form, Input, Radio } from 'antd';
import useI18NPrefix from 'app/hooks/useI18NPrefix';
import { FC, useCallback } from 'react';
import { JobTypes, JOB_TYPES_OPTIONS } from '../../constants';
import { checkScheduleName } from '../../services';
import { ExecuteFormItem, ExecuteFormItemProps } from './ExecuteFormItem';

const { RangePicker } = DatePicker;

interface BasicBaseFormProps extends ExecuteFormItemProps {
  orgId: string;
  isAdd?: boolean;
  initialName?: string;
  onJobTypeChange: (j: JobTypes) => void;
}
export const BasicBaseForm: FC<BasicBaseFormProps> = ({
  onJobTypeChange,
  orgId,
  isAdd,
  initialName,
  children,
  ...restProps
}) => {
  const t = useI18NPrefix(
    'main.pages.schedulePage.sidebar.editorPage.basicBaseForm.index',
  );
  const checkNameUnique = useCallback(
    async (_, name) => {
      if (!isAdd && initialName === name) {
        return Promise.resolve();
      }
      if (!name) {
        return Promise.resolve();
      } else {
        const res = await checkScheduleName(orgId, name);
        return res ? Promise.resolve() : Promise.reject(t('nameAlreadyExists'));
      }
    },
    [orgId, isAdd, initialName, t],
  );
  return (
    <>
      <Form.Item
        label={t('name')}
        hasFeedback
        name="name"
        validateTrigger={'onBlur'}
        rules={[
          { required: true, message: t('nameRequired') },
          { validator: checkNameUnique },
        ]}
      >
        <Input autoComplete="new-name" />
      </Form.Item>
      <Form.Item label={t('type')} name="jobType">
        <Radio.Group
          options={JOB_TYPES_OPTIONS}
          onChange={e => onJobTypeChange(e.target.value)}
        />
      </Form.Item>
      <Form.Item label={t('effectiveTimeRange')} name={'dateRange'}>
        <RangePicker allowClear showTime format="YYYY-MM-DD HH:mm:ss" />
      </Form.Item>
      <ExecuteFormItem {...restProps} />
    </>
  );
};
