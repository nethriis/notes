<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { load } from 'cheerio'

import { useNotesStore } from '@/store/notes'
import { useDateFns } from '@/hooks/useDateFns'

const store = useNotesStore()
const { format } = useDateFns()

const props = defineProps<{
	newNote?: boolean
}>()

const emit = defineEmits<{
	noteCreated: []
}>()

const newNoteInput = ref<HTMLInputElement | null>(null)
const isEnterPressed = ref(false)
const newNoteName = ref('New Note')

const notesPreview = computed(() => {
	const folder = store.currentFolderNotes

	return folder.map((note) => {
		const html = note.content || ''
		const $ = load(html)

		return $.text()
	})
})

const createNote = async (event: KeyboardEvent | FocusEvent) => {
	if (isEnterPressed.value) {
		isEnterPressed.value = false
		return
	}

	if (event instanceof KeyboardEvent && event.target instanceof HTMLInputElement) {
		isEnterPressed.value = true
		event.target.blur()
	}

	if (store.currentFolder && newNoteName.value !== '') {
		await window.context.createNote(store.currentFolder, newNoteName.value)
		await store.loadRecentNotes()
		await store.selectFolder(store.currentFolder)
		store.selectNote(newNoteName.value)
	}
	emit('noteCreated')
	newNoteName.value = 'New Note'
}

watch(() => props.newNote, async (value) => {
	if (value) {
		await nextTick()
		newNoteInput.value?.focus()
	}
})
</script>

<template>
	<nav>
		<ul class="px-4 space-y-4">
			<li
				v-if="newNote"
				class="p-4 space-y-2 bg-zinc-200 rounded-md transition-colors cursor-pointer"
			>
				<div>
					<input
						ref="newNoteInput"
						type="text"
						v-model="newNoteName"
						@keyup.enter="createNote"
						@blur="createNote"
						class="ring-1 ring-inset ring-zinc-400 rounded bg-transparent font-medium outline-none"
					/>
				</div>
			</li>
			<li
				v-for="note, i of store.currentFolderNotes"
				@click="store.selectNote(note.title)"
				class="p-4 space-y-2 bg-zinc-200 hover:bg-zinc-300 rounded-md transition-colors cursor-pointer"
				:class="{
					'bg-zinc-300': store.selectedNote?.title === note.title,
				}"
			>
				<div>
					<span class="font-medium">{{ note.title }}</span>
				</div>
				<div class="flex items-center space-x-2 text-sm">
					<span class="text-zinc-500">{{ format(new Date(note.date), 'dd/MM/yyyy') }}</span>
					<span class="whitespace-nowrap text-ellipsis text-zinc-600 overflow-hidden">
						{{ notesPreview[i] }}
					</span>
				</div>
			</li>
		</ul>
	</nav>
</template>
