/*
 * @Author: your name
 * @Date: 2023-10-26 10:46:54
 * @LastEditTime: 2023-10-26 14:16:29
 * @LastEditors: LAPTOP-HVHI0UBN
 * @Description: In User Settings Edit
 * @FilePath: \vue3-demo\src\utils\exportTableUtil.js
 */
import XLSX from "xlsx";
import XLSXStyle from "xlsx-style";
import FileSaver from "file-saver";
export default {
  /**
   *
   * @param elt
   * @param sheetName
   * @param fileName 导出的文件名
   * @param titleNum  标题行数
   */
  exportTable(elt, sheetName, fileName, titleNum) {
    let wb = XLSX.utils.table_to_book(elt, { sheet: sheetName, raw: true });
    let range = XLSX.utils.decode_range(wb.Sheets[sheetName]["!ref"]);
    //单元格边框样式
    let borderStyle = {
      top: {
        style: "thin",
        color: { rgb: "000000" },
      },
      bottom: {
        style: "thin",
        color: { rgb: "000000" },
      },
      left: {
        style: "thin",
        color: { rgb: "000000" },
      },
      right: {
        style: "thin",
        color: { rgb: "000000" },
      },
    };
    let cWidth = [];
    for (let C = range.s.c; C < range.e.c; ++C) {
      //SHEET列
      let len = 100; //默认列宽
      let len_max = 400; //最大列宽
      for (let R = range.s.r; R <= range.e.r; ++R) {
        //SHEET行
        let cell = { c: C, r: R }; //二维 列行确定一个单元格
        let cell_ref = XLSX.utils.encode_cell(cell); //单元格 A1、A2
        if (wb.Sheets[sheetName][cell_ref]) {
          // if (R == 0){
          if (R < titleNum) {
            wb.Sheets[sheetName][cell_ref].s = {
              //设置第一行单元格的样式 style
              font: {
                sz: 15,
                color: { rgb: "060B0E" },
                bold: true,
              },
              alignment: {
                horizontal: "center",
                vertical: "center",
              },
              fill: {
                fgColor: { rgb: "E4E4E4" },
              },
              border: borderStyle, //用上面定义好的边框样式
            };
          } else {
            wb.Sheets[sheetName][cell_ref].s = {
              alignment: {
                horizontal: "left",
                vertical: "center",
              },
              border: borderStyle, //用上面定义好的边框样式
            };
          }
          //动态自适应：计算列宽
          let va = JSON.parse(JSON.stringify(wb.Sheets[sheetName][cell_ref].v));
          var card1 = JSON.parse(JSON.stringify(va)).match(/[\u4e00-\u9fa5]/g); //匹配中文
          var card11 = "";
          if (card1) {
            card11 = card1.join("");
          }
          var card2 = JSON.parse(JSON.stringify(va)).replace(
            /[\u4e00-\u9fa5]/g,
            ""
          ); //剔除中文
          let st = 0;
          if (card11) {
            // st += card11.length * 16  //中文字节码长度
            st += card11.length * 20; //中文字节码长度
          }
          if (card2) {
            // st += card2.length * 8  //非中文字节码长度
            st += card2.length * 10; //非中文字节码长度
          }
          if (st > len) {
            len = st;
          }
        }
      }
      if (len > len_max) {
        //最大宽度
        len = len_max;
      }
      cWidth.push({ wpx: len }); //列宽
    }
    wb.Sheets[sheetName]["!cols"] = cWidth;
    var wopts = { bookType: "xlsx", bookSST: false, type: "binary" };
    var wbout = XLSXStyle.write(wb, wopts); //一定要用XLSXStyle不要用XLSX，XLSX是没有格式的！
    FileSaver(new Blob([this.s2ab(wbout)], { type: "" }), fileName + ".xlsx");
  },
  s2ab(s) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
    return buf;
  },
};
