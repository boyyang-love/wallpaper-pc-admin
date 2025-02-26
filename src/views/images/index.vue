<script setup lang="tsx">
import {NButton, NPopconfirm, NTag} from 'naive-ui'
import {fetchImageDel, fetchImageInfoList} from '@/service/api'
import {$t} from '@/locales'
import {useAppStore} from '@/store/modules/app'
import {useTable, useTableOperate} from '@/hooks/common/table'
import OperateDrawer from './modules/operate-drawer.vue'
import Search from './modules/search.vue'
import {imageUrl} from '@/utils/imageUrl'
import {fileSize} from '@/utils/fileSize'

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
  apiFn: fetchImageInfoList,
  showTotal: true,
  apiParams: {
    page: 1,
    limit: 10,
    file_name: null,
    type: null,
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
      key: 'file_name',
      title: $t('page.image.name'),
      align: 'left',
      minWidth: 100,
    },
    {
      key: 'file_path',
      title: $t('page.image.img'),
      align: 'center',
      minWidth: 100,
      render: row => {
        return <div>
          <n-image src={imageUrl(row.file_path)} width="200" object-fit="cover"></n-image>
        </div>
      },
    },
    {
      key: 'file_size',
      title: $t('page.image.size'),
      align: 'center',
      width: 100,
      render: row => {
        return <span>
          {fileSize(row.file_size)}
        </span>
      },
    },
    {
      key: 'type',
      title: $t('page.image.type'),
      align: 'center',
      width: 100,
    },
    {
      key: 'w',
      title: $t('page.image.px'),
      align: 'center',
      width: 100,
      render: row => {
        return <span>
          {row.w}x{row.h}
        </span>
      },
    },
    {
      key: 'status',
      title: $t('page.image.status'),
      align: 'center',
      width: 100,
      render: row => {
        if (row.status === null) {
          return null
        }

        const tagMap: Record<Api.Common.EnableStatus, NaiveUI.ThemeColor> = {
          1: 'success',
          2: 'warning',
        }

        return <NTag
          type={tagMap[row.status as unknown as Api.Common.EnableStatus]}>{row.status === 1 ? $t('page.image.enable') : $t('page.image.disable')}
        </NTag>
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
          <NPopconfirm onPositiveClick={() => handleDelete(row.id, [row.file_path, row.origin_file_path])}>
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

async function handleDelete(id: string, paths: string[]) {
  // request
  await fetchImageDel({id: id, paths: paths, bucket_name: 'wallpaper'})

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
