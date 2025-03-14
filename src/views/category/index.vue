<script setup lang="tsx">
import {NButton, NPopconfirm} from 'naive-ui'
import {$t} from '@/locales'
import {useAppStore} from '@/store/modules/app'
import {useTable, useTableOperate} from '@/hooks/common/table'
import OperateDrawer from './modules/operate-drawer.vue'
import Search from './modules/search.vue'
import {fetchCategoryList, fetchCategoryRemove, fetchCategorySort} from '@/service/api/category'
import dayjs from 'dayjs'
import {ref} from 'vue'

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
  apiFn: fetchCategoryList,
  showTotal: true,
  apiParams: {
    page: 1,
    limit: 10,
    name: '',
  },
  columns: () => [
    {
      type: 'selection',
      align: 'center',
      width: 48,
    },
    // {
    //   key: 'index',
    //   title: $t('common.index'),
    //   align: 'center',
    //   width: 60,
    // },
    {
      key: 'sort',
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
      key: 'created',
      title: $t('common.created'),
      align: 'center',
      minWidth: 200,
      render: row => {
        return dayjs(row.created).format('YYYY-MM-DD HH:mm')
      },
    },
    {
      key: 'updated',
      title: $t('common.updated'),
      align: 'center',
      minWidth: 200,
      render: row => {
        return dayjs(row.updated).format('YYYY-MM-DD HH:mm')
      },
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

  await onBatchDeleted()
}

async function handleDelete(id: string) {
  // request
  await fetchCategoryRemove({id: id})

  await onDeleted()
}

function edit(id: string) {
  handleEdit(id)
}

const sortLoading = ref<boolean>(false)

async function setSort() {
  const sortData = data.value.map(d => {
    return {
      id: d.id,
      sort: d.index,
    }
  })
  sortLoading.value = true
  const {error} = await fetchCategorySort({sort_data: sortData})
  if (!error) {
    window?.$message?.success('设置排序成功')
    await getData()
  }
  sortLoading.value = false
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
        >
          <template #prefix>
            <NButton size="small" @click="setSort">
              <template #icon>
                <icon-material-symbols-light:sort-by-alpha class="text-icon" :class="{ 'animate-spin': loading }"/>
              </template>
              设置序号
            </NButton>
          </template>
        </TableHeaderOperation>
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
