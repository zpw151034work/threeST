<template>
  <div class="export-table-excel" @click="exportExcel">
    <slot>
      <el-button icon="el-icon-download export-table-excel" size="small" type="primary">
        导出Excel
      </el-button>
    </slot>
  </div>
</template>

<script>
import * as xlsx from 'xlsx';
import * as XLSXS from "xlsx-js-style";

export default {
  name: 'ExportTableExcel',
  props: {
    //数据类型 request->数据请求  data->数组
    type: {
      type: String,
      default: 'data'
    },
    //导出数据数组
    dataList: {
      type: Array,
      default: () => []
    },
    //请求方法
    method: {
      type: String,
      default: 'POST'
    },
    //请求url
    url: {
      type: String,
      default: null
    },
    //请求参数
    data: {
      type: Object,
      default: () => ({})
    },
    //导出页面的this (填this即可)  用于寻找el-table
    parent: {
      type: Object,
      required: true,
      default: null
    },
    //导出文件名
    exportName: {
      type: String,
      default: '数据导出'
    },
    //忽略列的label数组
    ignore: {
      type: Array,
      default: () => []
    },
    //数据获取 传入data -> 默认输出data
    getDataList: {
      type: Function,
      default: (data) => data
    },
    //格式化
    /**
     * { prop : Function(value) , ...}  prop->表格项prop字段    方法入参为该字段值
     */
    formatter: {
      type: Object,
      default: null
    },
    //若二次封装传新的tag
    elTableTag: {
      type: String,
      default: 'el-table'
    },
    //表头背景色
    headerBackgroundColor: {
      type: String,
      default: 'D9D9D9'
    }
  },
  methods: {
    exportExcel() {
      const tableConfig = this.getTableColumnConfig(this.getTableObject());
      console.log(this.getTableObject(), 'getTableObject')
      this.createXlsx(tableConfig, this.dataList);
      /*
      //请求数据导出
      if (this.type === 'request') {
        request({
          url: this.url,
          method: this.method,
          data: this.data
        }).then(res => {
          this.createXlsx(tableConfig, this.getDataList(res.data));
        });
      } else {
        this.createXlsx(tableConfig, this.dataList);
      }*/
    },
    //获取table对象
    getTableObject() {
      const parent = this.parent ? this.parent : this.$parent;
      for (let i = 0; i < parent.$children.length; i++) {
        if (parent.$children[i].$vnode.componentOptions.tag === this.elTableTag) {
          console.log(parent.$children[i], 'parent.$children[i]')
          return parent.$children[i];
        }
      }
    },
    //获取table列配置
    getTableColumnConfig(tableObject) {
      let leve = 0;

      const headerConfig = [];

      const polishArray = (i) => {
        headerConfig.forEach((item, index) => {
          if (index !== i) {
            item.push('');
          }
        });
      };
      const getConfig = (array, parentColumnObject) => {
        array.forEach((item) => {
          if (item.$vnode.componentOptions.tag === 'el-table-column') {
            if (this.ignore.indexOf(item.label) > -1) return;
            if (headerConfig[leve] == null) headerConfig[leve] = leve === 0 ? [] : new Array(headerConfig[0].length).fill('');
            if (leve > 0) {
              if (parentColumnObject.childrenColumn == null) parentColumnObject.childrenColumn = [];
              parentColumnObject.childrenColumn.push(item);
              if (parentColumnObject.childrenColumn.length > 1) {
                headerConfig[leve].push(item);
                polishArray(leve);
              } else {
                headerConfig[leve][headerConfig[leve].length - 1] = item;
              }
            } else {
              headerConfig[leve].push(item);
              polishArray(leve);
            }
            if (item.$children.length > 0) {
              leve++;
              getConfig(item.$children, item);
              item.childrenColumn = null;
            }
          }
        });
        leve--;
      };
      getConfig(tableObject.$children, null);
      return headerConfig;
    },
    //创建xlax
    createXlsx(tableConfig, data) {
      //获取标题头
      const header = [];
      tableConfig.forEach((cols, index) => {
        header.push([]);
        cols.forEach(col => {
          header[index].push(col ? col.label : col);
        });
      });

      //获取每列对象
      const rowObjs = [];
      const getRow = (index) => {
        for (let i = header.length - 1; i > -1; i--) {
          if (tableConfig[i][index]) {
            return tableConfig[i][index];
          }
        }
      };
      tableConfig[0].forEach((item, index) => {
        rowObjs.push(getRow(index));
      });

      //填入数据
      const dataList = [...header];
      data.forEach((dataItem, rowIndex) => {
        const row = new Array(header[0].length).fill(null).map((item, index) => {
          if (rowObjs[index].type === 'index') return rowIndex + 1;
          return rowObjs[index].formatter ? rowObjs[index].formatter(dataItem, rowObjs[index].columnConfig) : (
            (this.formatter && this.formatter[rowObjs[index].prop]) ? this.formatter[rowObjs[index].prop](dataItem[rowObjs[index].prop]) : dataItem[rowObjs[index].prop]
          );
        });
        dataList.push(row);
      })

      const wb = xlsx.utils.book_new();
      const sheet = xlsx.utils.aoa_to_sheet(dataList);
      xlsx.utils.book_append_sheet(wb, sheet, 'sheet1');
      //基础样式
      this.setExlStyle(wb["Sheets"]["sheet1"], header.length);
      if (header.length > 1) {
        //表头合并单元格
        this.mergeHeaderCells(tableConfig, sheet);
        this.addRangeBorder(sheet['!merges'], wb["Sheets"]["sheet1"]);
      }
      //输出文件
      const ws = XLSXS.write(wb, { type: "buffer" });
      this.downloadFile(new Blob([ws]));
    },
    //合并表头单元格
    mergeHeaderCells(tableConfig, sheet) {
      const merges = [];
      for (let i = 0; i < tableConfig.length - 1; i++) {
        let start = null;
        let count = 0;
        for (let j = 0; j < tableConfig[0].length; j++) {
          //横向
          if ((tableConfig[i][j] || tableConfig[0][j] || j === tableConfig[0].length - 1) && start != null) {
            //合并 r(row)行 c(col)列
            if (count > 0) merges.push({ s: { r: i, c: start }, e: { r: i, c: start + count } });
            start = null;
            count = 0;
          }

          if (!tableConfig[i][j] && start != null) {
            count++;
          }

          if (tableConfig[i][j] && !tableConfig[i][j + 1]) {
            start = j;
            count = 0;
          }

          //竖向
          if (tableConfig[i][j] && !tableConfig[i + 1][j]) {
            merges.push({ s: { r: i, c: j }, e: { r: tableConfig.length - 1, c: j } });
          }
        }
      }
      sheet['!merges'] = merges;
    },
    //添加默认样式
    setExlStyle(data, headerRowCount) {
      let borderAll = {
        //单元格外侧框线
        top: {
          style: "thin",
        },
        bottom: {
          style: "thin",
        },
        left: {
          style: "thin",
        },
        right: {
          style: "thin",
        },
      };
      data["!cols"] = [];
      for (let key in data) {
        if (data[key] instanceof Object) {
          data[key].s = {
            border: borderAll,
            alignment: {
              horizontal: "center", //水平居中对齐
              vertical: "center",
            },
            font: {
              sz: 11,
            },
            bold: true,
            numFmt: 0,
          };
          data["!cols"].push({ wpx: 115 });

          if (headerRowCount != null && this.headerBackgroundColor != null) {
            //表头设置深色背景
            const rowNo = parseInt(key.replace(/[^0-9]/ig, ""));
            if (typeof rowNo === 'number' && rowNo <= headerRowCount) {
              data[key].s.fill = {
                fgColor: { rgb: this.headerBackgroundColor },
              };
            }
          }
        }
      }
      return data;
    },
    //解决合并单元格边框丢失
    addRangeBorder(range, ws) {
      // s:起始位置，e:结束位置
      let arr = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

      console.log(range, 'rangerangerange')
      range.forEach((item) => {
        let startRowNumber = Number(item.s.r);
        let startColumnNumber = Number(item.s.c);
        let endColumnNumber = Number(item.e.c);
        let endRowNumber = Number(item.e.r);
        //   合并单元格时会丢失边框样式，例如A1->A4 此时内容在A1 而range内获取到的是从0开始的，所以开始行数要+2
        for (let i = startColumnNumber; i <= endColumnNumber; i++) {
          for (let j = startRowNumber; j <= endRowNumber + 1; j++) {
            ws[arr[i] + j].s = {
              border: {
                //单元格外侧框线
                top: {
                  style: "thin",
                },
                bottom: {
                  style: "thin",
                },
                left: {
                  style: "thin",
                },
                right: {
                  style: "thin",
                },
              }
            };
          }
        }
      });
      return ws;
    },
    //下载文件
    downloadFile(blob) {
      const fileName = this.exportName + '.xlsx';
      const url = URL.createObjectURL(blob, { type: "application/octet-stream" });
      const a = document.createElement('a');
      a.setAttribute('download', fileName);
      a.href = url;
      a.click();
      URL.revokeObjectURL(url);
      a.remove();
    }
  }
};
</script>

<style lang="scss" scoped>
.export-table-excel {
  position: relative;
}
</style>
