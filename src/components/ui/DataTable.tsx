"use client";

import { useState, useEffect } from "react";
import {
  Table,
  Card,
  Space,
  Tooltip,
  Dropdown,
  Checkbox,
  MenuProps,
  Button,
  Input,
} from "antd";
import { FilterOutlined, SettingOutlined, SearchOutlined } from "@ant-design/icons";
import type { ColumnsType, TableProps } from "antd/es/table";
import { useAppSelector } from "@/lib/redux/hooks";
import { getEffectiveTheme } from "@/utils/theme";

export interface FilterOption {
  key: string;
  label: string;
  value: any;
  filterFn?: (item: any) => boolean;
}

export interface DataTableProps<T> extends Omit<TableProps<T>, "columns" | "title"> {
  columns: ColumnsType<T>;
  dataSource: T[];
  loading?: boolean;
  rowKey?: string | ((record: T) => string);
  showFilter?: boolean;
  filterOptions?: FilterOption[];
  onFilterChange?: (value: any) => void;
  showColumnVisibility?: boolean;
  defaultColumnVisibility?: Record<string, boolean>;
  showSearch?: boolean;
  searchableColumns?: string[]; // Array of column keys to search in. If empty, searches all columns
  searchPlaceholder?: string;
  pagination?: TableProps<T>["pagination"] | false;
  title?: string;
  className?: string;
  filteredDataSource?: T[]; // Allow parent to control filtered data
}

export default function DataTable<T extends Record<string, any>>({
  columns,
  dataSource,
  loading = false,
  rowKey,
  showFilter = false,
  filterOptions = [],
  onFilterChange,
  showColumnVisibility = false,
  defaultColumnVisibility,
  showSearch = false,
  searchableColumns = [],
  searchPlaceholder = "Search...",
  pagination = {
    pageSize: 10,
    showSizeChanger: true,
    showTotal: (total) => `Total ${total} items`,
    responsive: true,
    showLessItems: true,
  },
  title,
  className,
  filteredDataSource,
  ...tableProps
}: DataTableProps<T>) {
  const { theme: themeMode } = useAppSelector((state) => state.ui);
  const { isCustomThemeActive, colors: customColors } = useAppSelector(
    (state) => state.themeGenerator
  );
  const theme = getEffectiveTheme(themeMode);

  const [filteredData, setFilteredData] = useState<T[]>(dataSource);
  const [activeFilter, setActiveFilter] = useState<any>(undefined);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [columnVisibility, setColumnVisibility] = useState<
    Record<string, boolean>
  >(
    defaultColumnVisibility ||
      columns.reduce((acc, col) => {
        if (col.key) {
          acc[col.key as string] = true;
        }
        return acc;
      }, {} as Record<string, boolean>)
  );

  // Initialize column visibility from columns
  useEffect(() => {
    if (!defaultColumnVisibility) {
      const visibility: Record<string, boolean> = {};
      columns.forEach((col) => {
        if (col.key) {
          visibility[col.key as string] = true;
        }
      });
      setColumnVisibility(visibility);
    }
  }, [columns, defaultColumnVisibility]);

  // Apply search filter
  const applySearchFilter = (data: T[], query: string): T[] => {
    if (!query.trim()) return data;

    const lowerQuery = query.toLowerCase();
    
    // Get searchable columns
    let searchableCols: string[] = [];
    if (searchableColumns.length > 0) {
      searchableCols = searchableColumns;
    } else {
      // If no specific columns provided, search in all columns with dataIndex
      searchableCols = columns
        .filter((col) => {
          // Check if column has dataIndex (not a ColumnGroupType)
          return 'dataIndex' in col && col.dataIndex && col.key;
        })
        .map((col) => {
          const colWithIndex = col as { key: string; dataIndex: string | string[] };
          // Handle array dataIndex (nested paths)
          if (Array.isArray(colWithIndex.dataIndex)) {
            return colWithIndex.dataIndex.join('.');
          }
          return colWithIndex.dataIndex as string;
        });
    }

    return data.filter((item) => {
      return searchableCols.some((colKey) => {
        // Handle nested paths (e.g., "user.name")
        const keys = colKey.split('.');
        let value: any = item;
        for (const key of keys) {
          if (value === null || value === undefined) return false;
          value = value[key];
        }
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(lowerQuery);
      });
    });
  };

  // Update filtered data when dataSource, filter, or search changes
  useEffect(() => {
    let data = dataSource;

    // Apply filter first
    if (filteredDataSource !== undefined) {
      // Use parent-controlled filtered data
      data = filteredDataSource;
    } else if (onFilterChange) {
      // If custom filter handler is provided, notify parent but don't filter here
      // Parent will handle filtering and pass filteredDataSource
      onFilterChange(activeFilter);
      data = dataSource;
    } else if (activeFilter !== undefined && filterOptions.length > 0) {
      // Default filter logic
      const filterOption = filterOptions.find((opt) => opt.value === activeFilter);
      if (filterOption && filterOption.filterFn) {
        data = dataSource.filter(filterOption.filterFn);
      }
    }

    // Apply search filter
    if (showSearch && searchQuery) {
      data = applySearchFilter(data, searchQuery);
    }

    setFilteredData(data);
  }, [dataSource, activeFilter, filterOptions, onFilterChange, filteredDataSource, searchQuery, showSearch, searchableColumns, columns]);

  // Filter columns based on visibility
  const visibleColumns = columns.filter(
    (col) => columnVisibility[col.key as string] !== false
  );

  // Filter menu items
  const filterMenuItems: MenuProps["items"] = [
    {
      key: "all",
      label: "All",
      onClick: () => {
        setActiveFilter(undefined);
        if (onFilterChange) {
          onFilterChange(undefined);
        } else {
          setFilteredData(dataSource);
        }
      },
    },
    {
      type: "divider",
    },
    ...filterOptions.map((option) => ({
      key: option.key,
      label: option.label,
      onClick: () => {
        setActiveFilter(option.value);
        if (onFilterChange) {
          onFilterChange(option.value);
        } else if (option.filterFn) {
          const filtered = dataSource.filter(option.filterFn);
          setFilteredData(filtered);
        }
      },
    })),
  ];

  // Column visibility menu items
  const columnVisibilityMenuItems: MenuProps["items"] = columns
    .filter((col) => col.key)
    .map((col) => ({
      key: col.key as string,
      label: (
        <Checkbox
          checked={columnVisibility[col.key as string] !== false}
          onChange={(e) => {
            setColumnVisibility((prev) => ({
              ...prev,
              [col.key as string]: e.target.checked,
            }));
          }}
          onClick={(e) => e.stopPropagation()}>
          {col.title as string}
        </Checkbox>
      ),
    }));

  const toolbarBg = isCustomThemeActive
    ? customColors.surface
    : theme === "dark"
    ? "#1f1f1f"
    : "#f5f5f5";

  const tableContent = (
    <div className="overflow-x-auto">
        {(showFilter || showColumnVisibility || showSearch) && (
          <Space
            className="flex-wrap justify-between w-full rounded-t-lg p-2 mb-2"
            style={{ backgroundColor: toolbarBg }}>
            {showSearch && (
              <Input
                placeholder={searchPlaceholder}
                prefix={<SearchOutlined />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                allowClear
                style={{ maxWidth: 300 }}
                className="w-full sm:w-auto"
              />
            )}
            <Space className="flex-wrap justify-end">
            {showFilter && filterOptions.length > 0 && (
              <Tooltip title="Filter">
                <Dropdown
                  menu={{ items: filterMenuItems }}
                  placement="bottomLeft">
                  <Button
                    icon={<FilterOutlined />}
                    type={activeFilter ? "primary" : "default"}>
                    {activeFilter &&
                      filterOptions.find((opt) => opt.value === activeFilter)
                        ?.label && (
                        <span className="ml-1">
                          (
                          {
                            filterOptions.find(
                              (opt) => opt.value === activeFilter
                            )?.label
                          }
                          )
                        </span>
                      )}
                  </Button>
                </Dropdown>
              </Tooltip>
            )}
            {showColumnVisibility && (
              <Tooltip title="Column Visibility">
                <Dropdown
                  menu={{ items: columnVisibilityMenuItems }}
                  placement="bottomLeft">
                  <Button icon={<SettingOutlined />} />
                </Dropdown>
              </Tooltip>
            )}
            </Space>
          </Space>
        )}
        <Table
          columns={visibleColumns}
          dataSource={filteredData}
          loading={loading}
          rowKey={rowKey}
          scroll={{ x: "max-content" }}
          pagination={pagination}
          size="small"
          className="min-w-full"
          {...tableProps}
        />
      </div>
  );

  if (title) {
    return (
      <Card className={className} title={title}>
        {tableContent}
      </Card>
    );
  }

  return <div className={className}>{tableContent}</div>;
}

