(function (window) {
    "use strict";

    function defineLibrary() {
        const MyForm = {
            author: "mapkeji26",

            // Inputs
            fio: document.getElementsByName("fio")[0],
            email: document.getElementsByName("email")[0],
            phone: document.getElementsByName("phone")[0],

            getData() {
                return {
                    fio: this.fio.value,
                    email: this.email.value,
                    phone: this.phone.value
                };
            },

            setData(object) {
                for (let prop of Object.keys(object)) {
                    const value = object[prop];
                    if (["fio", "email", "phone"].includes(prop)) {
                        this[prop].value = value;
                    }
                }
            },

            validate() {
                const data = this.getData();
                let errorFields = [];

                // Check FIO length
                if (data.fio.trim().split(/\s+/).length !== 3) {
                    errorFields.push("fio");
                }

                // Check Email
                const emailRegular = /^\w+@(?:ya\.ru|yandex\.(?:ru|ua|by|kz|com))$/;
                if (!emailRegular.test(data.email)) {
                    errorFields.push("email");
                }

                // Check Phone
                const sum = data.phone.replace(/\D+/g, "").split("").reduce((a, b) => +a + +b);
                if (sum > 30) {
                    errorFields.push("phone");
                }

                return {
                    isValid: errorFields.length <= 0,
                    errorFields: errorFields
                };

            },

            submit() {
                for (let input of document.getElementsByTagName("input")) {
                    input.classList.remove("error");
                }

                result.className = "";
                result.innerHTML = "";

                if (this.validate().isValid) {
                    submitButton.disabled = true;
                    let getResponse = () => {
                        fetch(myForm.action).then(data => data.json()).then(data => {
                            switch (data.status) {
                                case "success":
                                    result.className = "success";
                                    result.innerHTML = "Success";
                                    break;
                                case "error":
                                    result.className = "error";
                                    result.innerHTML = data.reason;
                                    break;
                                case "progress":
                                    result.className = "progress";
                                    setTimeout(() => {
                                        getResponse();
                                    }, data.timeout);
                                    break;
                            }
                        });
                    };
                    getResponse();
                } else {
                    for (let field of this.validate().errorFields) {
                        this[field].className = "error";
                    }
                }
            }

        };

        return MyForm;
    }

    if (typeof(MyForm) === "undefined") {
        window.MyForm = defineLibrary();
    }
    else {
        console.log("MyForm is already defined.");
    }
})(window);

const myForm = document.getElementById("myForm");
const submitButton = document.getElementById("submitButton");
const result = document.getElementById("resultContainer");

myForm.addEventListener("submit", (e) => {
    e.preventDefault();
    MyForm.submit();
});
