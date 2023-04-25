<template>
   <div class="flex bg-slate-100 h-full justify-center items-center">
       <div class="flex-wrapper flex flex-col gap-5 ">
          <div class="flex">
             <div class="flex flex-col bg-white border shadow-md gap-4 p-5 w-full">
                <div class="header w-full">
                   <h1 class=" text-lg text-indigo-600 font-bold">Upload File</h1>
                </div>
                <div class="flex" >
                   <form class="flex flex-col gap-5 w-full" @submit.prevent="uploadFile"  enctype="multipart/form-data">
                      <div class="form-group flex flex-col">
                         <label for="file">Choose a file</label>
                         <input  ref="file" class="p-2 border border-neutral-900/40" type="file" @change="onFileChange">
                      </div>
                      <div class="form-group">
                         <button type="submit" class=" bg-indigo-600 py-3 font-bold text-blue-100 w-full">Upload</button>
                      </div>
                      <progress :value="progress" max="100" class="w-full">
                         {{ progress }}%
                      </progress>
                   </form>  
                </div>
             </div>
          </div>
          <div class="flex">
             <div class="flex flex-col bg-white border shadow-md gap-4 p-5 w-full">
                <div class="header">
                   <h1 class=" text-lg text-indigo-600 font-bold">List of Files</h1>
                </div>
                <div class="flex flex-col gap-2">
                   <div v-if="loading" class="flex p-4 bg-stone-100 border">
                      <h1>Loading...</h1>
                   </div>
                   <div v-else-if="fileList.length > 0" v-for="(file, index) in fileList" :key="index" class="flex p-4 bg-stone-100 border">
                      <h1>{{file}}</h1>
                   </div>
                   <div v-else class="flex p-4 bg-stone-100 border">
                      <h1>No files uploaded yet</h1>
                   </div>
                </div>
             </div>
          </div>
       </div>
   </div>
 </template>
 
 <script>
 import axios from 'axios'
 
 export default {
    name: 'FormUpload',
    // split file to chunk
    data() {
       return {
          file: null,
          progress: 0,
          loading: true,
          fileList:[]
       }
    },
    computed:{
       async getfileList(){
          try {
             const res = await axios.get('/api/getFiles')
             this.loading = false
 
             console.log(res.data)
             return res.data
          } catch(err) {
             console.log(err)
          }
       }
    }, 
    async mounted() {
       this.fileList = await this.getfileList
       console.log(this.fileList)
    },
    methods: {
       onFileChange(e) {
          this.file = e.target.files[0]
       },
       uploadFile() {
 
          if(this.file === null) {
             this.$toast.show({
                   type: 'error',
                   title: 'Error',
                   message: 'Please select a file',
                   classTimeout: 'bg-red-400'
             })
             return
          }
          const formData = new FormData()
          formData.append('file', this.file)
 
          axios.post('/api/upload', formData, {
             onUploadProgress: progressEvent => {
                this.progress = parseInt(Math.round((progressEvent.loaded * 100) / progressEvent.total))
             }
          })
          .then(async res => {
             console.log(res)
             this.fileList = await this.getfileList
             this.fileList.push(this.file.name)
             this.$toast.show({
                   type: 'success',
                   title: 'Success',
                   message: 'File uploaded successfully',
                   classTimeout: 'bg-green-400'
             })
             this.$refs.file.value = null
             this.progress = 0            
 
          })
          .catch(err => {
             console.log(err)
          })
 
 
       }
    }
 
 }
 </script>
 
 