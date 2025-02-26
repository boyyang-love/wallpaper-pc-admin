<script setup lang="ts">
import {$t} from '@/locales'
import {useNaiveForm} from '@/hooks/common/form'

defineOptions({
  name: 'Search',
})

interface Emits {
  (e: 'reset'): void;

  (e: 'search'): void;
}

const emit = defineEmits<Emits>()

const {formRef, validate, restoreValidation} = useNaiveForm()

const model = defineModel<Api.Image.ImageListSearchParams>('model', {required: true})

const imageTypeOptions = [
  {
    label: 'MOA',
    value: 'MOA',
  },
  {
    label: 'PC',
    value: 'PC',
  },
]

const imageStatusOptions = [
  {
    label: $t('page.image.enable'),
    value: '1',
  },
  {
    label: $t('page.image.disable'),
    value: '2',
  },
]

async function reset() {
  await restoreValidation()
  emit('reset')
}

async function search() {
  await validate()
  emit('search')
}
</script>

<template>
  <NCard :bordered="false" size="small" class="card-wrapper">
    <NCollapse>
      <NCollapseItem :title="$t('page.image.title')" name="search">
        <NForm ref="formRef" :model="model" label-placement="left" :label-width="80">
          <NGrid responsive="screen" item-responsive>
            <NFormItemGi span="24 s:12 m:6" :label="$t('page.image.name')" path="" class="pr-24px">
              <NInput
                v-model:value="model.file_name"
                clearable
                placeholder="请输入名称"
              />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" :label="$t('page.image.type')" path="" class="pr-24px">
              <NSelect
                v-model:value="model.type"
                :options="imageTypeOptions"
                clearable
                placeholder="请选择图片类型"
              />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" :label="$t('page.image.status')" path="" class="pr-24px">
              <NSelect
                v-model:value="model.status"
                :options="imageStatusOptions"
                clearable
                placeholder="请选择图片专题"
              />
            </NFormItemGi>
            <NFormItemGi span="24 m:12" class="pr-24px">
              <NSpace class="w-full" justify="end">
                <NButton @click="reset">
                  <template #icon>
                    <icon-ic-round-refresh class="text-icon"/>
                  </template>
                  {{ $t('common.reset') }}
                </NButton>
                <NButton type="primary" ghost @click="search">
                  <template #icon>
                    <icon-ic-round-search class="text-icon"/>
                  </template>
                  {{ $t('common.search') }}
                </NButton>
              </NSpace>
            </NFormItemGi>
          </NGrid>
        </NForm>
      </NCollapseItem>

    </NCollapse>
  </NCard>
</template>

<style scoped></style>
