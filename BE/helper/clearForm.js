export const clearForm = (form) => {
    if (!form) return;
    form.querySelectorAll("input, select, textarea").forEach(field => {
        field.value = ""; // Xóa giá trị của từng field
        if (field.type === "checkbox" || field.type === "radio") {
            field.checked = false; // Bỏ chọn checkbox và radio
        }
    });
};
