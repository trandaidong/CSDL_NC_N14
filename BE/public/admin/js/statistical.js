const defaultPath = "/admin/api/v1/statistical"
const periodSelect = document.querySelector("#period");

const formPeriod = document.querySelector("#form-period");
const formPeriodBranchs = document.querySelector("#form-period-branchs");
const formPeriodDishs = document.querySelector("#form-period-dish");
if (periodSelect) {
    periodSelect.addEventListener('change', () => {
        const selectedOption = periodSelect.options[periodSelect.selectedIndex]; // Lấy option đã chọn
        const selectedValue = selectedOption.value;
        const formDay = document.querySelector(".form-day");
        const formMonth = document.querySelector(".form-month");
        const formQuarter = document.querySelector(".form-quarter");
        const formYear = document.querySelector(".form-year");
        switch (selectedValue) {
            case "day":
                formDay.style.display = "";
                formMonth.style.display = 'none';
                formQuarter.style.display = 'none';
                formYear.style.display = 'none';
                if (formPeriod) {
                    formPeriod.action = defaultPath + "/day";
                }
                if (formPeriodBranchs) {
                    formPeriodBranchs.action = defaultPath + "/dayBranchs";
                }
                if (formPeriodDishs) {
                    formPeriodDishs.action = defaultPath + "/dayDishs"
                }
                break;
            case "month":
                formMonth.style.display = "";
                formDay.style.display = 'none';
                formQuarter.style.display = 'none';
                formYear.style.display = 'none';

                if (formPeriod) {
                    formPeriod.action = defaultPath + "/month";
                }
                if (formPeriodBranchs) {
                    formPeriodBranchs.action = defaultPath + "/monthBranchs";
                }
                if (formPeriodDishs) {
                    formPeriodDishs.action = defaultPath + "/monthDishs"
                }
                break;
            case "quarter":
                formQuarter.style.display = "";
                formDay.style.display = 'none';
                formMonth.style.display = 'none';
                formYear.style.display = 'none';

                if (formPeriod) {
                    formPeriod.action = defaultPath + "/quarter";
                }
                if (formPeriodBranchs) {
                    formPeriodBranchs.action = defaultPath + "/quarterBranchs";
                }
                if (formPeriodDishs) {
                    formPeriodDishs.action = defaultPath + "/quarterDishs"
                }
                break;
            case "year":
                formYear.style.display = "";
                formDay.style.display = 'none';
                formMonth.style.display = 'none';
                formQuarter.style.display = 'none';

                if (formPeriod) {
                    formPeriod.action = defaultPath + "/year";
                }
                if (formPeriodBranchs) {
                    formPeriodBranchs.action = defaultPath + "/yearBranchs";
                }
                if (formPeriodDishs) {
                    formPeriodDishs.action = defaultPath + "/yearDishs"
                }
                break;
            default:
        }
    })
}
