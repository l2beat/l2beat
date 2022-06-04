export function configureTableView() {

  document.addEventListener('DOMContentLoaded', function () {
    // eslint-disable-next-line
    // @ts-ignore
    new DataTable('.TableView-Table', {paging: false, searching:false, columnDefs: [
      { orderable: false, targets: 2 },
      { orderable: false, targets: 3 }
    ],});
  });
}
