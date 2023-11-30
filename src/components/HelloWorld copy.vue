<!--
 * @Author: your name
 * @Date: 2023-11-04 18:25:37
 * @LastEditTime: 2023-11-04 18:25:37
 * @LastEditors: LAPTOP-HVHI0UBN
 * @Description: In User Settings Edit
 * @FilePath: \vuecli-demo\src\components\HelloWorld copy.vue
-->
<!--
 * @Author: your name
 * @Date: 2023-10-26 10:42:37
 * @LastEditTime: 2023-11-04 18:25:01
 * @LastEditors: LAPTOP-HVHI0UBN
 * @Description: In User Settings Edit
 * @FilePath: \vue3-demo\src\App copy.vue
-->
<template>
  <el-table :data="tableData" :span-method="spanMethod" style="width: 100%" id="oIncomTable">
    <el-table-column prop="date" label="日期">
    </el-table-column>
    <el-table-column label="配送信息">
      <el-table-column prop="name" label="姓名">
      </el-table-column>
      <el-table-column label="地址">
        <el-table-column prop="province" label="省份">
        </el-table-column>
        <el-table-column prop="city" label="市区">
        </el-table-column>
        <el-table-column prop="address" label="地址">
        </el-table-column>
        <el-table-column prop="zip" label="邮编">
        </el-table-column>
      </el-table-column>
    </el-table-column>
    <el-table-column fixed="right" label="操作">
      <template>
        <el-button type="text" size="small" @change="exportData">查看</el-button>
        <!-- <export-table-excel :parent="this" :data-list="tableData" :ignore="['操作']" :formatter="{
          col6: (val) => val === 1 ? '在线' : '离线'
        }" export-name="测试数据导出" /> -->
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
import exportTableUtil from '../utils/exportTableUtil.js'
import XLSX from "xlsx";
import XLSXS from "xlsx-style";
import FileSaver from "file-saver";
// import ExportTableExcel from "./exportTableExcel.vue";
export default {
  name: 'HelloWorld',
  // components: { ExportTableExcel },
  data() {
    return {
      tableData: [{
        date: '2016-05-03',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333
      }, {
        date: '2016-05-02',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333
      }, {
        date: '2016-05-04',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333
      }, {
        date: '2016-05-01',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333
      }, {
        date: '2016-05-08',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333
      }, {
        date: '2016-05-06',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333
      }, {
        date: '2016-05-07',
        name: '王小虎',
        province: '上海',
        city: '普陀区',
        address: '上海市普陀区金沙江路 1518 弄',
        zip: 200333
      }],
      isSHow: true,
    };
  },
  methods: {
    exportData() {
      this.onExportExcel()
      // this.exportToExcel('自定义文件名称', document.querySelector('#oIncomTable'), this);
    },
    spanMethod({ row, column, rowIndex, columnIndex }) {
      console.log(row, column, columnIndex)
      if (rowIndex == 0) { //行 
        if (columnIndex == 2) { //列
          return {
            rowspan: 1, //行
            colspan: 2  //列
          }
        }
        if (columnIndex == 3) { //列
          return {
            rowspan: 0, //行
            colspan: 0  //列
          }
        }
      }
      else if (rowIndex == 1) { //行 
        if (columnIndex == 5) { //列
          return {
            rowspan: 1, //行
            colspan: 1  //列
          }
        }
      }


      else {
        return {
          rowspan: 1,
          colspan: 1
        }
      }


    },
    // exportData() {
    //   let elt = document.getElementById("#oIncomTable");
    //   exportTableUtil.exportTable(elt, "加捻区物料异常表", "加捻区物料异常表导出", 9);
    // },
    onExportExcel() {
      this.isSHow = false;
      var xlsxParam = { raw: true } // 导出的内容只做解析，不进行格式转换
      // 这里的exportTable 就是给table起的id
      var wb = XLSX.utils.table_to_book(document.querySelector('#oIncomTable'), xlsxParam)
      var wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' })
      try {
        FileSaver.saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '申报汇总.xlsx')
      } catch (e) {
        if (typeof console !== 'undefined') {
          console.log(e, wbout)
        }
      }
      return wbout
    },
    s2ab(s) {
      var buf = new ArrayBuffer(s.length);
      var view = new Uint8Array(buf);
      for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
      return buf;
    },
    exportToExcel(fliename, dom, that) {

      this.isSHow = false;
      console.log(XLSXS, 'XLSXS')
      const XLSX = require('xlsx');
      console.log('XLSX', XLSX, FileSaver);
      // 使用 this.$nextTick 是在dom元素都渲染完成之后再执行document.querySelector('#oIncomTable')
      that.$nextTick(function () {
        // 设置导出的内容是否只做解析，不进行格式转换     false：要解析， true:不解析
        const xlsxParam = { raw: true };
        const wb = XLSX.utils.table_to_book(dom, xlsxParam);
        // 导出excel文件名
        let fileName = fliename + new Date().getTime() + '.xlsx';

        const wbout = XLSX.write(wb, {
          bookType: 'xlsx',
          bookSST: true,
          type: 'array',
        });
        try {
          // 下载保存文件
          FileSaver.saveAs(
            new Blob([wbout], { type: 'application/octet-stream' }),
            fileName
          );
        } catch (e) {
          if (typeof console !== 'undefined') {
            console.log(e, wbout);
          }
        }
        return wbout;
      });

      this.$nextTick(() => {
        this.isSHow = true;
      })
    }


  }
};
</script>