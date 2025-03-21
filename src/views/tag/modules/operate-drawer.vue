<script setup lang="ts">
import {computed, ref, watch} from 'vue'
import {useFormRules, useNaiveForm} from '@/hooks/common/form'
import {$t} from '@/locales'
import {type IUpload, useUpload} from '@/hooks/fileUpload'
import {imageUrl} from '@/utils/imageUrl'
import {fetchImageInfoUpdate} from '@/service/api'
import {fetchTagCreate, fetchTagUpdate} from '@/service/api/tag'

defineOptions({
  name: 'OperateDrawer',
})

interface Props {
  /** the type of operation */
  operateType: NaiveUI.TableOperateType;
  /** the edit row data */
  rowData?: Api.Tag.TagInfo | null;
}

const props = defineProps<Props>()

interface Emits {
  (e: 'submitted'): void;
}

const emit = defineEmits<Emits>()

const visible = defineModel<boolean>('visible', {
  default: false,
})

const loading = ref<boolean>(false)

const {formRef, validate, restoreValidation} = useNaiveForm()
const {defaultRequiredRule} = useFormRules()

const title = computed(() => {
  const titles: Record<NaiveUI.TableOperateType, string> = {
    add: $t('common.add'),
    edit: $t('common.edit'),
  }
  return titles[props.operateType]
})

type Model = Pick<Api.Tag.TagInfo, 'id' | 'name' | 'type' | 'sort'>;

const model = ref(createDefaultModel())

function createDefaultModel(): Model {
  return {
    id: '',
    name: '',
    type: '',
  }
}

type RuleKey = Extract<keyof Model, 'type' | 'name'>;

const rules: Record<RuleKey, App.Global.FormRule> = {
  name: defaultRequiredRule,
  type: defaultRequiredRule,
}

function handleInitModel() {
  model.value = createDefaultModel()

  if (props.operateType === 'edit' && props.rowData) {
    Object.assign(model.value, props.rowData)
  }
}

function closeDrawer() {
  visible.value = false
}

async function handleSubmit() {
  await validate()
  loading.value = true
  if (props.operateType === 'add') {
    const {error: err} = await fetchTagCreate({
      name: model.value.name,
      type: model.value.type,
      sort: model.value.sort,
    })
    if (!err) {
      window.$message?.success($t('common.addSuccess'))
    }
  }

  if (props.operateType === 'edit') {
    const {error: err} = await fetchTagUpdate({
      id: model.value.id,
      name: model.value.name,
      type: model.value.type,
      sort: model.value.sort,
    })
    if (!err) {
      window.$message?.success($t('common.updateSuccess'))
    }
  }

  loading.value = false
  closeDrawer()
  emit('submitted')
}

watch(visible, () => {
  if (visible.value) {
    handleInitModel()
    restoreValidation()
  }
})
</script>

<template>
  <NDrawer v-model:show="visible" display-directive="show" :width="360">
    <NDrawerContent :title="title" :native-scrollbar="false" closable>
      <NForm ref="formRef" :model="model" :rules="rules">
        <NFormItem :label="$t('page.tag.name')" path="name">
          <NInput v-model:value="model.name" placeholder="请输入标签名称"/>
        </NFormItem>
        <NFormItem :label="$t('page.tag.type')" path="type">
          <NInput v-model:value="model.type" placeholder="请输入标签类型"/>
        </NFormItem>
        <NFormItem :label="$t('page.tag.sort')" path="type">
          <NInputNumber class="w-full" v-model:value="model.sort" placeholder="请输入标签排序"/>
        </NFormItem>
      </NForm>
      <template #footer>
        <NSpace :size="16">
          <NButton @click="closeDrawer">{{ $t('common.cancel') }}</NButton>
          <NButton type="primary" @click="handleSubmit" :loading="loading">{{ $t('common.confirm') }}</NButton>
        </NSpace>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>

<style scoped></style>
