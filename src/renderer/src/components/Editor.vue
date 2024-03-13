<script setup lang="ts">
import { ref, watch } from 'vue'
import { useEditor, EditorContent  } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Highlight from '@tiptap/extension-highlight'
import Typography from '@tiptap/extension-typography'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Link from '@tiptap/extension-link'
import { debounce } from 'lodash'

import { useNotesStore } from '@/store/notes'
import Modal from '@/components/Modal.vue'
import BoldIcon from '@/components/Icon/Bold.vue'
import ItalicIcon from '@/components/Icon/Italic.vue'
import UnderlineIcon from '@/components/Icon/Underline.vue'
import ImageIcon from '@/components/Icon/Image.vue'
import LinkIcon from '@/components/Icon/Link.vue'
import BulletList from '@/components/Icon/BulletList.vue'
import OrderedList from '@/components/Icon/OrderedList.vue'
import CheckList from '@/components/Icon/CheckList.vue'

const props = defineProps<{
	modelValue: string
}>()

const emit = defineEmits<{
	'update:modelValue': [value: string],
	'save': []
}>()

const editor = useEditor({
  content: props.modelValue || '',
  extensions: [
    StarterKit,
		Underline,
		Highlight,
		Typography,
		TaskList,
		Link,
		TaskItem.configure({
			nested: false
		}),
  ],
	onUpdate: () => {
		emit('update:modelValue', editor.value?.getHTML() || '')
		saveNote()
	}
})

const store = useNotesStore()

watch(() => props.modelValue, (value: string) => {
	const isSame = editor.value?.getHTML() === value

	if (!isSame) {
		editor.value?.commands.setContent(value, false)
	}
})

const saveNote = debounce(() => {
	if (editor.value && store.selectedNote) {
		window.context.saveNote(
			store.selectedNote?.folder, store.selectedNote?.title, editor.value?.getHTML()
		)
		store.loadRecentNotes()
		emit('save')
	}
}, 1000)

const setLink = () => {
	editor.value?.commands.setLink({ href: linkInput.value, target: '_blank' })
	modalLinkOpen.value = false
	setTimeout(() => linkInput.value = '', 300)
}

const modalImageOpen = ref(false)
const modalLinkOpen = ref(false)
const linkInput = ref('')
</script>

<template>
	<div class="editor">
		<Modal v-model:open="modalImageOpen">
			<template #header>Insert an image</template>
			<template #default>
				<input type="file" accept="image/*" class="mt-4 transition-colors outline-none" />
			</template>
		</Modal>
		<Modal v-model:open="modalLinkOpen">
			<template #header>Insert a link</template>
			<template #default>
				<form @submit.prevent="" class="space-x-2 mt-4 flex">
					<input
						type="url"
						v-model="linkInput"
						placeholder="https://example.com"
						class="px-3 py-1.5 ring-1 ring-inset ring-zinc-200 focus:ring-zinc-400 rounded-md w-full text-sm transition-all outline-none"
					/>
					<button
						type="submit"
						class="inline-flex justify-center rounded-md border border-transparent bg-zinc-100 px-3 py-1.5 text-sm font-medium hover:bg-zinc-200 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
						@click="setLink()"
					>
						Insert
					</button>
				</form>
			</template>
		</Modal>
		<menu
			type="toolbar"
			class="border-y border-y-zinc-200 py-2 space-x-4 bg-white flex sticky -top-[49px] z-10"
		>
			<ul class="flex">
				<li class="flex">
					<button
						type="button"
						@click="editor?.chain().focus().toggleBold().run()"
						class="rounded-md w-8 h-8 flex items-center justify-center transition-colors"
						:class="{
							'bg-zinc-100': editor?.isActive('bold')
						}"
					>
						<BoldIcon class="w-5 h-5" />
					</button>
				</li>
				<li class="flex">
					<button
						type="button"
						@click="editor?.chain().focus().toggleItalic().run()"
						class="rounded-md w-8 h-8 flex items-center justify-center transition-colors"
						:class="{
							'bg-zinc-100': editor?.isActive('italic')
						}"
					>
						<ItalicIcon class="w-5 h-5" />
					</button>
				</li>
				<li>
					<button
						type="button"
						@click="editor?.chain().focus().toggleUnderline().run()"
						class="rounded-md w-8 h-8 flex items-center justify-center transition-colors"
						:class="{
							'bg-zinc-100': editor?.isActive('underline')
						}"
					>
						<UnderlineIcon class="w-5 h-5" />
					</button>
				</li>
			</ul>
			<ul class="flex">
				<li>
					<button
						type="button"
						@click="() => modalImageOpen = true"
						class="rounded-md w-8 h-8 flex items-center justify-center transition-colors"
					>
						<ImageIcon class="w-5 h-5" />
					</button>
				</li>
				<li>
					<button
						type="button"
						@click="() =>
							editor?.isActive('link')
								? editor.chain().unsetLink().run()
								: modalLinkOpen = true
						"
						class="rounded-md w-8 h-8 flex items-center justify-center transition-colors"
						:class="{
							'bg-zinc-100': editor?.isActive('link')
						}"
					>
						<LinkIcon class="w-5 h-5" />
					</button>
				</li>
			</ul>
			<ul class="flex">
				<li>
					<button
						type="button"
						@click="editor?.chain().focus().toggleBulletList().run()"
						class="rounded-md w-8 h-8 flex items-center justify-center transition-colors"
						:class="{
							'bg-zinc-100': editor?.isActive('bulletList')
						}"
					>
						<BulletList class="w-5 h-5" />
					</button>
				</li>
				<li>
					<button
						type="button"
						@click="editor?.chain().focus().toggleOrderedList().run()"
						class="rounded-md w-8 h-8 flex items-center justify-center transition-colors"
						:class="{
							'bg-zinc-100': editor?.isActive('orderedList')
						}"
					>
						<OrderedList class="w-5 h-5" />
					</button>
				</li>
				<li>
					<button
						type="button"
						@click="editor?.chain().focus().toggleTaskList().run()"
						class="rounded-md w-8 h-8 flex items-center justify-center transition-colors"
						:class="{
							'bg-zinc-100': editor?.isActive('taskList')
						}"
					>
						<CheckList class="w-5 h-5" />
					</button>
				</li>
			</ul>
		</menu>
		<EditorContent :editor="editor" class="pt-8" />
	</div>
</template>

<style>
.tiptap.ProseMirror {
	@apply outline-none;
}

.tiptap.ProseMirror p {
	@apply text-sm;
}

.tiptap.ProseMirror p > code {
	@apply px-1 py-0.5 rounded-sm bg-zinc-100 font-['DM_Mono',monospace] text-xs text-zinc-700;
}

.tiptap.ProseMirror pre > * {
	@apply font-['DM_Mono',monospace];
}

.tiptap.ProseMirror pre {
	@apply p-4 rounded-md bg-zinc-100 text-xs text-zinc-700;
}

.tiptap.ProseMirror h1 {
	@apply pt-4 text-3xl font-bold leading-tight tracking-tight;
}

.tiptap.ProseMirror h2 {
	@apply pt-4 text-2xl font-semibold leading-tight tracking-tight;
}

.tiptap.ProseMirror h3 {
	@apply pt-4 text-xl font-semibold leading-tight tracking-tight;
}

.tiptap.ProseMirror h4 {
	@apply pt-4 text-lg font-semibold leading-tight tracking-tight;
}

.tiptap.ProseMirror h5 {
	@apply pt-4 text-base font-semibold leading-tight tracking-tight;
}

.tiptap.ProseMirror h6 {
	@apply pt-4 text-sm font-semibold leading-tight tracking-tight;
}

.tiptap.ProseMirror blockquote {
	@apply relative pl-3 after:absolute after:top-0 after:left-0 after:w-0.5 after:h-full after:bg-blue-500;
}

.tiptap.ProseMirror ul:not([data-type='taskList']) {
	@apply list-disc pl-5 marker:text-xs marker:text-zinc-500;
}

.tiptap.ProseMirror ol {
	@apply list-decimal pl-5 marker:text-sm marker:text-zinc-500 whitespace-pre;
}

.tiptap.ProseMirror ul[data-type='taskList'] li {
	@apply pl-2 space-x-2 flex;
}

.tiptap.ProseMirror ul[data-type='taskList'] li[data-checked='true'] {
	@apply line-through text-zinc-500;
}

.tiptap.ProseMirror a {
	@apply text-blue-500 hover:text-blue-400 underline cursor-pointer;
}
</style>
