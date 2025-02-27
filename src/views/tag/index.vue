<script setup lang="tsx">
import {NButton, NPopconfirm} from 'naive-ui'
import {fetchImageDel} from '@/service/api'
import {$t} from '@/locales'
import {useAppStore} from '@/store/modules/app'
import {useTable, useTableOperate} from '@/hooks/common/table'
import OperateDrawer from './modules/operate-drawer.vue'
import Search from './modules/search.vue'
import {fetchTagInfoList, fetchTagRemove} from '@/service/api/tag'

const appStore = useAppStore()

const {
  columns,
  columnChecks,
  data,
  getData,
  getDataByPage,
  loading,
  mobilePagination,
  searchParams,
  resetSearchParams,
} = useTable({
  apiFn: fetchTagInfoList,
  showTotal: true,
  apiParams: {
    page: 1,
    limit: 10,
    type: '',
    name: '',
  },
  columns: () => [
    {
      type: 'selection',
      align: 'center',
      width: 48,
    },
    {
      key: 'index',
      title: $t('common.index'),
      align: 'center',
      width: 60,
    },
    {
      key: 'name',
      title: $t('page.tag.name'),
      align: 'left',
      minWidth: 200,
    },
    {
      key: 'type',
      title: $t('page.tag.type'),
      align: 'center',
      minWidth: 200
    },
    {
      key: 'operate',
      title: $t('common.operate'),
      align: 'center',
      width: 130,
      render: row => (
        <div class="flex-center gap-8px">
          <NButton type="primary" ghost size="small" onClick={() => edit(row.id)}>
            {$t('common.edit')}
          </NButton>
          <NPopconfirm onPositiveClick={() => handleDelete(row.id)}>
            {{
              default: () => $t('common.confirmDelete'),
              trigger: () => (
                <NButton type="error" ghost size="small">
                  {$t('common.delete')}
                </NButton>
              ),
            }}
          </NPopconfirm>
        </div>
      ),
    },
  ],
})


const {
  drawerVisible,
  operateType,
  editingData,
  handleAdd,
  handleEdit,
  checkedRowKeys,
  onBatchDeleted,
  onDeleted,
} = useTableOperate(data, getData)

async function handleBatchDelete() {
  // request
  console.log(checkedRowKeys.value)

  await onBatchDeleted()
}

async function handleDelete(id: string) {
  // request
  await fetchTagRemove({id: id})

  await onDeleted()
}

function edit(id: string) {
  handleEdit(id)
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <Search v-model:model="searchParams" @reset="resetSearchParams" @search="getDataByPage"/>
    <NCard title="图片" :bordered="false" size="small" class="sm:flex-1-hidden card-wrapper">
      <template #header-extra>
        <TableHeaderOperation
          v-model:columns="columnChecks"
          :disabled-delete="checkedRowKeys.length === 0"
          :loading="loading"
          @add="handleAdd"
          @delete="handleBatchDelete"
          @refresh="getData"
        />
      </template>
      <NDataTable
        v-model:checked-row-keys="checkedRowKeys"
        :columns="columns"
        :data="data"
        size="small"
        :flex-height="!appStore.isMobile"
        :scroll-x="962"
        :loading="loading"
        remote
        :row-key="row => row.id"
        :pagination="mobilePagination"
        class="sm:h-full"
      />
      <OperateDrawer
        v-model:visible="drawerVisible"
        :operate-type="operateType"
        :row-data="editingData"
        @submitted="getData"
      />
    </NCard>
  </div>
</template>

<style scoped></style>
