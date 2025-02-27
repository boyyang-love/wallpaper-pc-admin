<script setup lang="ts">
import {computed, ref, watch} from 'vue'
import {useFormRules, useNaiveForm} from '@/hooks/common/form'
import {$t} from '@/locales'
import {type IUpload, useUpload} from '@/hooks/fileUpload'
import {imageUrl} from '@/utils/imageUrl'
import {fetchImageInfoUpdate} from '@/service/api'
import {fetchTagInfoList} from '@/service/api/tag'

defineOptions({
  name: 'OperateDrawer',
})

interface Props {
  /** the type of operation */
  operateType: NaiveUI.TableOperateType;
  /** the edit row data */
  rowData?: Api.Image.ImageInfo | null;
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

type Model = Pick<Api.Image.ImageInfo, 'id' | 'file_name' | 'type' | 'status' | 'file_path'> & { tags: string[] };

const model = ref(createDefaultModel())

function createDefaultModel(): Model {
  return {
    id: '',
    file_path: '',
    file_name: '',
    type: '',
    status: 2,
    tags: [],
  }
}

type RuleKey = Extract<keyof Model, 'type' | 'file_name'>;

const rules: Record<RuleKey, App.Global.FormRule> = {
  type: defaultRequiredRule,
  file_name: defaultRequiredRule,
}

const imageOptions = ref<CommonType.Option[]>([])
const tagOptions = ref<CommonType.Option[]>([])


function handleInitModel() {
  model.value = createDefaultModel()

  if (props.operateType === 'edit' && props.rowData) {
    Object.assign(model.value, {...props.rowData, tags: props.rowData.tags.map(t => t.id)})
  }
}

function closeDrawer() {
  visible.value = false
}

async function handleSubmit() {
  await validate()
  loading.value = true
  if (props.operateType === 'add') {
    const uploadParams = fileInfo.fileList.map(it => {
      return {
        file: it?.file,
        file_name: it.name,
        root_dir: 'IMAGES',
        dir: 'PCANDMOA',
        type: model.value.type,
        bucket_name: 'wallpaper',
        status: model.value.status,
        quality: 60,
        tags: model.value.tags,
      }
    })

    const res = await upload(uploadParams as unknown as IUpload.UploadParams[])
    const errs = res.filter(r => r.error !== null)

    if (errs.length) {
      loading.value = false
      return
    }

    window.$message?.success($t('common.addSuccess'))
  } else {
    const {error: err} = await fetchImageInfoUpdate({
      id: model.value.id,
      file_name: model.value.file_name,
      type: model.value.type,
      status: model.value.status,
      tags: model.value.tags,
    })
    if (!err) {
      window.$message?.success($t('common.updateSuccess'))
    }
  }
  loading.value = false
  reset()
  closeDrawer()
  emit('submitted')
}

function getImageOptions() {
  imageOptions.value = [
    {
      label: 'MOA',
      value: 'MOA',
    },
    {
      label: 'PC',
      value: 'PC',
    },
  ]
}

async function getTagOptions() {
  const {data, error} = await fetchTagInfoList({page: 1, limit: 10000})
  if (error) {
    return
  }

  tagOptions.value = data?.records.map(d => {
    return {
      label: d.name,
      value: d.id,
    }
  })
}

const {uploadRef, onChange, fileInfo, reset, upload} = useUpload(() => {
  model.value.file_name = fileInfo.fileList[0].name
})


watch(visible, async () => {
  if (visible.value) {
    handleInitModel()
    getImageOptions()
    await restoreValidation()
    await getTagOptions()
    reset()
  }
})
</script>

<template>
  <NDrawer v-model:show="visible" display-directive="show" :width="360">
    <NDrawerContent :title="title" :native-scrollbar="false" closable>
      <NForm ref="formRef" :model="model" :rules="rules">
        <NFormItem :label="$t('page.image.img')" path="file">
          <NUpload
            v-if="props.operateType === 'add' "
            ref="uploadRef"
            @change="onChange"
            accept=".jpg,.png,.jpeg"
            :max="1"
            :show-file-list="true"
            :file-list="fileInfo.fileList"
          >
            <n-upload-dragger v-if="fileInfo.fileList.length <= 0">
              <div style="margin-bottom: 12px">
                <icon-local-rad class="text-24px text-red"/>
              </div>
              <n-text style="font-size: 12px">
                点击或者拖动文件到该区域来上传
              </n-text>
            </n-upload-dragger>
            <NCollapse v-else>
              <template
                v-for="item in fileInfo.fileList"
                :key="item.id"
              >
                <NImage
                  :src="item.base64"
                ></NImage>
              </template>
            </NCollapse>

          </NUpload>
          <NImage :src="imageUrl(model.file_path)" v-else></NImage>
        </NFormItem>
        <NFormItem :label="$t('page.image.name')" path="file_name">
          <NInput v-model:value="model.file_name" placeholder="请输入图片名称"/>
        </NFormItem>
        <NFormItem :label="$t('page.image.type')" path="type">
          <NSelect
            v-model:value="model.type"
            :options="imageOptions"
            placeholder="请选择图片类型"
          />
        </NFormItem>
        <NFormItem :label="$t('page.image.tag')" path="status">
          <NSelect
            v-model:value="model.tags"
            :options="tagOptions"
            multiple
            filterable
            placeholder="请选择图片标签"
          />
        </NFormItem>
        <NFormItem :label="$t('page.image.status')" path="status">
          <NSwitch v-model:value="model.status" :checked-value="1" :unchecked-value="2"></NSwitch>
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
