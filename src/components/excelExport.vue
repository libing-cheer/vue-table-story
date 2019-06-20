<template>
  <div class="hello">
    {{msg}}
    <div>
      <el-button
        type="primary"
        size="mini"
        style="margin:20px auto;"
        @click="handleDownloadData"
      >导出</el-button>
      <el-table
        :data="tableData"
        stripe
        style="width: 1100px;margin:30px auto;"
      >
      <el-table-column 
          v-for="(item, index) in tableTitleData"
          :key="index"
          :label="item.label"
          :prop="item.prop"
          :width="item.width"
          align="center">
          <template slot-scope="scope">
            <!-- 图片预览部分 -->
            <span v-if="item.prop === 'pictureUrl'" v-viewer style="cursor:zoom-in;">
              <img :src="scope.row[item.prop]" alt="" width="60" height="60">
            </span>
            <!-- 视频播放部分 -->
            <span v-else-if="item.prop === 'videoUrl' " class="player" @click="getVideoUrl(scope.row)">
              <video-player
                  class="video-player vjs-custom-skin"
                  ref="videoPlayer"
                  :playsinline="true"
                  :options="playerOptions"
                  @play="onPlayerPlay($event)"
                  @pause="onPlayerPause($event)"
                  @ended="onPlayerEnded($event)"
                  @waiting="onPlayerWaiting($event)"
                  @playing="onPlayerPlaying($event)"
                  @loadeddata="onPlayerLoadeddata($event)"
                  @timeupdate="onPlayerTimeupdate($event)"
                  @canplay="onPlayerCanplay($event)"
                  @canplaythrough="onPlayerCanplaythrough($event)"
                  @statechanged="playerStateChanged($event)"
                  @ready="playerReadied"
                >
                </video-player>
            </span>
            <span v-else>{{scope.row[item.prop]}}</span>
          </template>
      </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { videoPlayer } from 'vue-video-player';
export default {
  name: 'excelExport',
  components: {
    videoPlayer
  },
  data() {
    return {
      msg: 'Welcome to Your Excel Export',
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1510 弄',
          pictureUrl: 'https://fscdn.zto.com/fs1/M02/7D/91/wKhBFl0K63OAT78bAAjVrwsew74430.jpg',
          videoUrl: 'http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4',
          type: 'video/mp4'
        },
        {
          date: '2016-05-04',
          name: '李小虎',
          address: '上海市普陀区金沙江路 1511 弄',
          pictureUrl: 'https://fscdn.zto.com/fs1/M00/7D/92/wKhBFV0K64aAYBMSAAOy35jxtjI497.jpg',
          videoUrl: 'https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm',
          type: 'video/mp4' // 视频格式
        },
        {
          date: '2016-05-01',
          name: '孙小虎',
          address: '上海市普陀区金沙江路 1512 弄',
          pictureUrl: 'https://fscdn.zto.com/fs1/M02/7D/95/wKhBFV0K66KAejgMAAAxXTKGWYk772.jpg',
          videoUrl: 'http://www.17sucai.com/preview/501914/2017-08-04/%E9%A1%B5%E9%9D%A2/media/mov_bbb.mp4',
          type: 'video/mp4'
        }],
      tableTitleData: [
        {
          label: '日期',
          prop: 'date',
          width: '180'
        },
        {
          label: '姓名',
          prop: 'name',
          width: '180'
        },
        {
          label: '地址',
          prop: 'address',
          width: '200'
        },
        {
          label: '照片',
          prop: 'pictureUrl',
          width: '180'
        },
        {
          label: '视频',
          prop: 'videoUrl',
          width: '350'
        }
      ],
      // 视频播放相关
      playerOptions: {
        playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
        autoplay: false, //如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: 'auto', 
        // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。
        // auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:9', 
        // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。
        // 值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, 
        // 当fluid为true时，Video.js player将拥有流体大小。
        // 换句话说，它将按比例缩放以适应其容器。
        sources: [
          {
            type: "video/mp4",
            src: "http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4" 
            //你的视频地址（必填）
            }
          ],
        poster: "../../static/poster.png", //你的封面地址
        width: document.documentElement.clientWidth,
        notSupportedMessage: '此视频暂无法播放，请稍后再试', 
        //允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true  //全屏按钮
        }
      }
    }
  },
  methods: {
    handleDownloadData() {
      // 导出表格的表头设置
      let allColumns = this.tableTitleData
      var columnNames = []
      var columnValues = []
      for (var i = 0; i < allColumns.length; i++) {
        columnNames[i] = allColumns[i].label
        columnValues[i] = allColumns[i].prop
      }
      require.ensure([], () => {
        const { export_json_to_excel } = require('vendor/Export2Excel')
        const tHeader = columnNames
        const filterVal = columnValues

        const list = this.tableData
        const data = this.formatJson(filterVal, list)
        export_json_to_excel(tHeader, data, '导出excel列表demo')
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    getVideoUrl(row) {
      this.playerOptions.sources[0].type = row.type
      this.playerOptions.sources[0].src = row.videoUrl
    },
    // 播放事件
    onPlayerPlay() { },
    // 暂停事件
    onPlayerPause() { },
    // 播放结束事件
    onPlayerEnded() {},
    onPlayerWaiting() {},
    onPlayerPlaying() {},
    onPlayerLoadeddata() {},
    onPlayerTimeupdate() {},
    onPlayerTimeupdate() {},
    onPlayerCanplay() {},
    onPlayerCanplaythrough() {},
    playerStateChanged() {},
    playerReadied(player) {
      // console.log('the player is readied', player)
      // you can use it to do something...
      // player.[methods]
    }
  }
}
</script>
