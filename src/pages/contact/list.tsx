import CustomAvatar from '@/components/custom-avatar';
import { Text } from '@/components/text';
import { CONTACTS_LIST_QUERY  } from '@/graphql/queries';
import { Contact } from '@/graphql/schema.types';
import { ContactsListQuery } from '@/graphql/types';
import { SearchOutlined } from '@ant-design/icons';
import { CreateButton, DeleteButton, EditButton, FilterDropdown, List, useTable } from '@refinedev/antd'
import { HttpError, getDefaultFilter, useGo } from '@refinedev/core'
import { GetFieldsFromList } from '@refinedev/nestjs-query';
import { Input, Space, Table } from 'antd';

export const ContactList = ({ children }: React.PropsWithChildren) => {
  const go = useGo();
  const { tableProps, filters } = useTable<
    GetFieldsFromList<ContactsListQuery>,
    HttpError,
    GetFieldsFromList<ContactsListQuery>
  >({
    resource: 'contacts',
    onSearch: (values) => {
      return [
        {
          field: 'name',
          operator: 'contains',
          value: values.name
        }
      ]
    },
    pagination: {
      pageSize: 12,
    },
    sorters: {
      initial: [
        {
          field: 'createdAt',
          order: 'desc'
        }
      ]
    },
    filters: {
      initial: [
        {
          field: 'name',
          operator: 'contains',
          value: undefined
        }
      ]
    },
    meta: {
      gqlQuery: CONTACTS_LIST_QUERY
    }
  })

  return (
    <div>
      <List
        breadcrumb={false}
        headerButtons={() => (
          <CreateButton
            onClick={() => {
              go({
                to: {
                  resource: 'contacts',
                  action: 'create'
                },
                options: {
                  keepQuery: true
                },
                type: 'replace'
              })
            }}
          />
        )}
      >
        <Table
          {...tableProps}
          pagination={{ ...tableProps.pagination }}
        >
          <Table.Column<Contact>
            dataIndex="name"
            title="Contact Name"
            defaultFilteredValue={getDefaultFilter('id', filters)}
            filterIcon={<SearchOutlined />}
            filterDropdown={(props) => (
              <FilterDropdown {...props}>
                <Input placeholder="Search Contact" />
              </FilterDropdown>
            )}
            render={(value, record) => (
              <Space>
                <CustomAvatar shape="square" name={record.name} src={record.avatarUrl} />
                <Text style={{ whiteSpace: 'nowrap' }}>
                  {record.name}
                </Text>
              </Space>
            )}
          />
          <Table.Column<Contact>
            dataIndex="company"
            title="Company"
            render={(value, record) => (
                <Text style={{ whiteSpace: 'nowrap' }}>
                  {record.company.name}
                </Text>
            )}
          />
          <Table.Column<Contact>
            dataIndex="jobTitle"
            title="Title"
            render={(value, record) => (
                <Text style={{ whiteSpace: 'nowrap' }}>
                  {record.jobTitle}
                </Text>
            )}
          />
          <Table.Column<Contact>
            dataIndex="phone"
            title="Phone"
            render={(value, record) => (
                <Text style={{ whiteSpace: 'nowrap' }}>
                  {record.phone}
                </Text>
            )}
          />
          <Table.Column<Contact>
            dataIndex="id"
            title="Actions"
            fixed="right"
            render={(value) => (
              <Space>
                <EditButton hideText size="small" recordItemId={value} />
                <DeleteButton hideText size="small" recordItemId={value} />
              </Space>
            )}
          />
        </Table>
      </List>
      {children}
    </div>
  )
}
