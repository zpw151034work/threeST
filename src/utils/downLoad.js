/*
 * @Author: your name
 * @Date: 2023-10-26 14:06:55
 * @LastEditTime: 2023-10-26 14:07:06
 * @LastEditors: LAPTOP-HVHI0UBN
 * @Description: In User Settings Edit
 * @FilePath: \vuecli-demo\src\utils\downLoad.js
 */
export function openDownloadDialog(url, saveName) {
  if (typeof url == "object" && url instanceof Blob) {
    url = URL.createObjectURL(url); // 创建blob地址
  }
  var aLink = document.createElement("a");
  aLink.href = url;
  aLink.download = saveName || ""; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
  var event;
  if (window.MouseEvent) event = new MouseEvent("click");
  else {
    event = document.createEvent("MouseEvents");
    event.initMouseEvent(
      "click",
      true,
      false,
      window,
      0,
      0,
      0,
      0,
      0,
      false,
      false,
      false,
      false,
      0,
      null
    );
  }
  aLink.dispatchEvent(event);
}
