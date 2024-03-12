<script setup lang="ts">
import { ref } from 'vue'

import { useNotesStore } from '@/store/notes'
import Layout from '@/components/Layout.vue'
import Titlebar from '@/components/Titlebar.vue'
import Sidebar from '@/components/Sidebar.vue'
import FolderList from '@/components/FolderList.vue'
import FolderNoteList from '@/components/FolderNoteList.vue'
import RecentNotes from '@/components/RecentNotes.vue'
import NoteContent from '@/components/NoteContent.vue'
import Plus from '@/components/Icon/Plus.vue'
import FolderPlus from '@/components/Icon/FolderPlus.vue'
import Star from '@/components/Icon/Star.vue'
import Trash from '@/components/Icon/Trash.vue'
import Archive from '@/components/Icon/Archive.vue'

const store = useNotesStore()

const newFolder = ref(false)
</script>

<template>
  <Layout>
    <Titlebar />
    <Sidebar class="w-60 space-y-6 bg-white z-20">
      <h1 class="px-3 pt-2 font-semibold text-sm">Notes</h1>
      <div class="px-4">
        <button class="w-full flex items-center justify-center py-1.5 bg-zinc-100 rounded-md text-sm font-medium">
          <Plus class="w-4 h-4 mr-1" />
          <span>New Note</span>
        </button>
      </div>
      <div>
        <p class="px-4 font-semibold text-xs text-zinc-500">Recents</p>
        <Suspense>
          <template #default>
            <RecentNotes />
          </template>
          <template #fallback>
            <div class="px-4 py-2 text-sm text-zinc-500">Loading...</div>
          </template>
        </Suspense>
      </div>
      <div>
        <div class="flex items-center justify-between">
          <p class="px-4 font-semibold text-xs text-zinc-500">Folders</p>
          <button
            type="button"
            @click="() => newFolder = true"
            class="px-4 text-zinc-500 hover:text-zinc-900"
          >
            <FolderPlus class="w-4 h-4" />
          </button>
        </div>
        <Suspense>
          <template #default>
            <FolderList :newFolder="newFolder" @folderCreated="() => newFolder = false" />
          </template>
          <template #fallback>
            <div class="px-4 py-2 text-sm text-zinc-500">Loading...</div>
          </template>
        </Suspense>
      </div>
      <div>
        <p class="px-4 font-semibold text-xs text-zinc-500">More</p>
        <nav class="mt-1">
          <ul>
            <li class="w-full flex items-center px-4 py-1.5 font-medium text-sm text-zinc-500 hover:text-zinc-900 cursor-pointer">
              <Star class="w-4 h-4 mr-3" />
              <span class="whitespace-nowrap text-ellipsis overflow-hidden">Favorites</span>
            </li>
            <li class="w-full flex items-center px-4 py-1.5 font-medium text-sm text-zinc-500 hover:text-zinc-900 cursor-pointer">
              <Trash class="w-4 h-4 mr-3" />
              <span class="whitespace-nowrap text-ellipsis overflow-hidden">Trash</span>
            </li>
            <li class="w-full flex items-center px-4 py-1.5 font-medium text-sm text-zinc-500 hover:text-zinc-900 cursor-pointer">
              <Archive class="w-4 h-4 mr-3" />
              <span class="whitespace-nowrap text-ellipsis overflow-hidden">Archived Notes</span>
            </li>
          </ul>
        </nav>
      </div>
    </Sidebar>
    <Sidebar class="w-72 mt-8 space-y-4 bg-zinc-100">
      <h1 class="px-4 pt-4 font-semibold text-lg">{{ store.currentFolder }}</h1>
      <Suspense>
        <template #default>
          <FolderNoteList />
        </template>
        <template #fallback>
          <div class="px-4 py-2 text-zinc-500">Loading...</div>
        </template>
      </Suspense>
    </Sidebar>
    <NoteContent />
  </Layout>
</template>
