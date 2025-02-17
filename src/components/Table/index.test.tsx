/** *******************************************************************************************************************
  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
  
  Licensed under the Apache License, Version 2.0 (the "License").
  You may not use this file except in compliance with the License.
  You may obtain a copy of the License at
  
      http://www.apache.org/licenses/LICENSE-2.0
  
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.                                                                              *
 ******************************************************************************************************************** */
import React from 'react';
import { act, fireEvent, render } from '@testing-library/react';
import Table, { Column } from '.';

interface DataType {
    id: string;
    name: string;
    subRows?: DataType[];
}

const data: DataType[] = [{ id: '123', name: 'Item one' }];
const data10: DataType[] = [...Array(10).keys()].map((i) => ({
    id: `${i}`,
    name: `Item${i}`,
}));
const dataGroup: DataType[] = [...Array(10).keys()].map((i) => ({
    id: `${i}`,
    name: `Item${Math.floor(i / 2)}`,
})); // 5 groups by 'name'
const dataExpanded: DataType[] = [
    { id: '1', name: 'Item one' },
    { id: '2', name: 'Item two', subRows: [{ id: '23', name: 'Item 23' }] },
    { id: '3', name: 'Item three', subRows: [{ id: '33', name: 'Item 33' }] },
];

const columnDefinitions: Column<DataType>[] = [
    {
        id: 'id',
        Header: 'Id',
        accessor: 'id',
    },
    {
        id: 'name',
        Header: 'Name',
        accessor: 'name',
    },
];

describe('Table', () => {
    it('renders table title, headers and data', () => {
        const { getByText } = render(
            <Table
                tableTitle={'My Table'}
                columnDefinitions={columnDefinitions}
                items={data}
                disableSortBy={true}
                disableSettings={true}
                disablePagination={true}
                disableFilters={true}
                disableRowSelect={true}
                disableGroupBy={true}
            />
        );

        expect(getByText('My Table')).toBeVisible();
        expect(getByText('Id')).toBeVisible();
        expect(getByText('Name')).toBeVisible();
        expect(getByText('123')).toBeVisible();
        expect(getByText('Item one')).toBeVisible();
    });

    it('renders checkbox', () => {
        const { getByLabelText } = render(
            <Table
                tableTitle={'My Table'}
                columnDefinitions={columnDefinitions}
                items={data}
                disableSortBy={true}
                disableSettings={true}
                disablePagination={true}
                disableFilters={true}
                disableRowSelect={false}
                disableGroupBy={true}
            />
        );

        expect(getByLabelText('Checkbox to select row item')).toBeInTheDocument();
        expect(getByLabelText('Checkbox to select row item')).toBeEnabled();

        expect(getByLabelText('Checkbox to select all row items')).toBeInTheDocument();
    });

    it('disables checkboxes for rows where isItemDisabled evaluates to true', () => {
        const { getByLabelText, queryAllByLabelText } = render(
            <Table
                tableTitle={'My Table'}
                columnDefinitions={columnDefinitions}
                items={data}
                disableSortBy={true}
                disableSettings={true}
                disablePagination={true}
                disableFilters={true}
                isItemDisabled={() => true}
                disableGroupBy={true}
            />
        );

        expect(getByLabelText('Checkbox to select row item')).toBeInTheDocument();
        expect(getByLabelText('Checkbox to select row item')).toBeDisabled();

        // Should not render the select all box when individual items could be disabled
        expect(queryAllByLabelText('Checkbox to select all row items')).toHaveLength(0);
    });

    it('renders radio buttons', () => {
        const { getAllByRole, getByRole } = render(
            <Table
                tableTitle={'My Table'}
                columnDefinitions={columnDefinitions}
                items={data}
                disableSortBy={true}
                disableSettings={true}
                disablePagination={true}
                disableFilters={true}
                disableRowSelect={false}
                multiSelect={false}
                disableGroupBy={true}
            />
        );

        expect(getAllByRole('radio')).toHaveLength(1);
        expect(getByRole('radio')).toBeEnabled();
    });

    it('disables radio buttons for rows where isItemDisabled evaluates to true', () => {
        const { getAllByRole, getByRole } = render(
            <Table
                tableTitle={'My Table'}
                columnDefinitions={columnDefinitions}
                items={data}
                disableSortBy={true}
                disableSettings={true}
                disablePagination={true}
                disableFilters={true}
                isItemDisabled={() => true}
                multiSelect={false}
                disableGroupBy={true}
            />
        );

        expect(getAllByRole('radio')).toHaveLength(1);
        expect(getByRole('radio')).toBeDisabled();
    });

    it('renders search input without extra column for search field', () => {
        const { getByPlaceholderText, getAllByRole } = render(
            <Table
                tableTitle={'My Table'}
                columnDefinitions={columnDefinitions}
                items={data}
                disableSortBy={true}
                disableSettings={true}
                disablePagination={true}
                disableFilters={false}
                disableRowSelect={true}
                disableGroupBy={true}
            />
        );

        expect(getByPlaceholderText('Search')).toBeInTheDocument();
        expect(getAllByRole('columnheader')).toHaveLength(2);
    });

    it('renders pagination', () => {
        const { getByText, getByLabelText } = render(
            <Table
                tableTitle={'My Table'}
                columnDefinitions={columnDefinitions}
                items={data}
                disableSortBy={true}
                disableSettings={true}
                disablePagination={false}
                disableFilters={true}
                disableRowSelect={true}
                disableGroupBy={true}
            />
        );

        expect(getByText('1-1 of 1')).toBeVisible();
        expect(getByLabelText('last page')).toBeInTheDocument();
        expect(getByLabelText('next page')).toBeInTheDocument();
        expect(getByLabelText('previous page')).toBeInTheDocument();
        expect(getByLabelText('first page')).toBeInTheDocument();
    });

    it('renders settings', () => {
        const { getByLabelText } = render(
            <Table
                tableTitle={'My Table'}
                columnDefinitions={columnDefinitions}
                items={data}
                disableSortBy={true}
                disableSettings={false}
                disablePagination={true}
                disableFilters={true}
                disableRowSelect={true}
                disableGroupBy={true}
            />
        );

        expect(getByLabelText('settings')).toBeInTheDocument();
    });

    it('renders sort icons', () => {
        const { getAllByTitle } = render(
            <Table
                tableTitle={'My Table'}
                columnDefinitions={columnDefinitions}
                items={data}
                disableSortBy={false}
                disableSettings={true}
                disablePagination={true}
                disableFilters={true}
                disableRowSelect={true}
                disableGroupBy={true}
            />
        );

        expect(getAllByTitle('Toggle SortBy')).toHaveLength(2);
    });

    it('should trigger onFetchData if onFetchData is provided', () => {
        const handleFetchData = jest.fn();

        act(() => {
            render(
                <Table tableTitle={'My Table'} columnDefinitions={columnDefinitions} onFetchData={handleFetchData} />
            );
        });

        expect(handleFetchData).toHaveBeenCalledWith({
            pageIndex: 0,
            filterText: '',
            groupBy: [],
            pageSize: 10,
            showColumns: ['id', 'name'],
            sortBy: [],
        });
    });

    it('should trigger onFetchData if onFetchData is provided and the next page icon is clicked', () => {
        const handleFetchData = jest.fn();

        const { getByText, getByTestId } = render(
            <Table
                tableTitle={'My Table'}
                columnDefinitions={columnDefinitions}
                onFetchData={handleFetchData}
                rowCount={56}
                items={data10}
            />
        );

        act(() => {
            fireEvent.click(getByTestId('next-page'));
        });

        expect(getByText('11-20 of 56')).toBeVisible();

        expect(handleFetchData).toHaveBeenLastCalledWith({
            pageIndex: 1,
            filterText: '',
            groupBy: [],
            pageSize: 10,
            showColumns: ['id', 'name'],
            sortBy: [],
        });
    });

    it('should render data group', () => {
        const { getAllByRole } = render(
            <Table
                tableTitle={'My Table'}
                columnDefinitions={columnDefinitions}
                items={dataGroup}
                disableGroupBy={false}
                disableRowSelect={true}
                defaultGroups={['name']}
            />
        );

        expect(getAllByRole('rowgroup')[1].childNodes).toHaveLength(5);
    });

    it('should render filter', () => {
        const { getAllByPlaceholderText } = render(
            <Table
                tableTitle={'My Table'}
                columnDefinitions={columnDefinitions}
                items={dataGroup}
                disableRowSelect={true}
                disableColumnFilters={false}
            />
        );

        expect(getAllByPlaceholderText('Search 10 records...')).toHaveLength(2);
    });

    it('should render expanded table', () => {
        const { getAllByTitle, getByTitle } = render(
            <Table
                tableTitle={'My Table'}
                columnDefinitions={columnDefinitions}
                items={dataExpanded}
                disableExpand={false}
            />
        );

        expect(getByTitle('Toggle All Rows Expanded')).toBeInTheDocument();
        expect(getAllByTitle('Toggle Row Expanded')).toHaveLength(2);
    });
});
