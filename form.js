'use strict'
// function Validator(options){

//     function getParent(element, selector) {
//         while(element.parentElement){
//             if(element.parentElement.matches(selector)){
//                 return element.parentElement;
//             }
//             element = element.parentElement;
//         }
//     }
//     var selectorRules = {};

//     // Ham thuc hien validator
//     function validator(inputElement, rule) {
//         // var errorElement = getParent(inputElement, '.form-group')
//         var errorMessage;
//         var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector)

//         // lấy ra các rule of selector 
//         var rules = selectorRules[rule.selector];

//         //lặp qua từng rule và kiểm tra
//         //Nếu có lỗi thì dừng vc ktra
//         for(var i = 0; i < rules.length; ++i){
//             switch (inputElement.type) {
//                 case 'checkbox':
//                 case 'radio':
//                     errorMessage = rules[i](
//                         formElement.querySelector(rule.selector + ':checked')
//                     );                   
//                     break;
//                 default:
//                     errorMessage = rules[i](inputElement.value);
//             }
//             errorMessage = rules[i](inputElement.value);
//             if (errorMessage) break;
//         }

//         if(errorMessage) {
//             errorElement.innerText = errorMessage;
//             getParent(inputElement, options.formGroupSelector).classList.add('invalid')
//         } else {
//             errorElement.innerText = '';
//             getParent(inputElement, options.formGroupSelector).classList.remove('invalid');
//         }
//         return !errorMessage;
//     }
//     // Lay element cua form can validator
//     var formElement = document.querySelector(options.form)
    
//     if(formElement){
//         //Khi submit form
//         formElement.onsubmit = function(e){
//             e.preventDefault();

//             var isFormValid = true;
//             //thuc hiện lặp qua từng rule và validate
//             options.rules.forEach(function(rule){
//                 var inputElement = formElement.querySelector(rule.selector);
//                 var isValid = validator(inputElement, rule);
//                 if(!isValid){
//                     isFormValid = false;
//                 }
//             });

            
            
//             if(isFormValid){
//                 // trường hợp submit vs js
//                 if(typeof options.onSubmit === 'function'){
//                     var enableInputs = formElement.querySelectorAll('[name]')
//                     var formValues = Array.from(enableInputs).reduce(function(values, input){
                        
//                         switch(input.type) {
//                             case 'checkbox':
//                             case 'radio':
//                                 values[input.name] = formElement.querySelector('input[name="' + input.name + '"]:checked').value
//                             break;
//                             default:
//                                 values[input.name] = input.value

//                         }
                        
                        
//                         return values;
//                     },{});
//                     options.onSubmit(formValues);
//                 }
//             }
//             //trường hợp submit vs hành vi mặc định
//             else{
//                 // formElement.submit();
//                 console.error('ERROR')
//             }
//         }


//         //lặp qua mỗi rule và xủ lý
//         options.rules.forEach(function(rule){

//             // lưu lại các rule cho các input
//             if(Array.isArray(selectorRules[rule.selector])) {
//                 selectorRules[rule.selector].push(rule.test);
//             }else{
//                 selectorRules[rule.selector] = [rule.test]
//             }


//             var inputElement = formElement.querySelector(rule.selector);
            
//             // blur ra ngoai thi bao loi
//             if(inputElement) {
//                 //xu ly trg hop blur ra khoi input
//                 inputElement.onblur = function(){
//                     validator(inputElement, rule);
//                 }

//                 //xu ly khi ng dung nhap vapo input
//                 inputElement.oninput = function() {
//                     var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector)
//                     errorElement.innerText = '';
//                     getParent(inputElement, options.formGroupSelector).classList.remove('invalid');
//                 }

//             }
//         });
//     }
// }
// // Dinh nghia rules
// // Nguyen tac cua rules: 
// //1. Khi co loi => Tra ra mess loi
// //2. Khi hop le => Khong tra ra cai gi ca (undefined)
// Validator.isRequired = function(selector, message){
//     return {
//         selector: selector,
//         test: function(value) {
//             //trim() : loai bo dau cach
//             return value ? undefined : message || 'Vui long nhap truong nay'
//         }
//     };
// }
// Validator.isEmail = function(selector, message){
//     return {
//         selector: selector,
//         test: function(value) {
//             var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
//             return regex.test(value) ? undefined : message || 'Truong nay phai la email';
//         }
//     };
// }
// Validator.mineLength = function(selector, min, message){
//     return {
//         selector: selector,
//         test: function(value) {
//             return value.length >= min ? undefined : message || `Vui long nhap toi thieu ${min} ky tu` ;
//         }
//     };
// }
// Validator.isConfirmed = function(selector, getConfirmValue, message){
//     return {
//         selector: selector,
//         test: function(value) {
//             return value === getConfirmValue() ? undefined : message || 'gia tri nhap vao ko chinh xac';
//         }
//     };
// }









/*************************************************************************************************************************** */


function Validator(options){

    function getParent(element, selector) {
        while (element.parentElement) {
            if(element.parentElement.matches(selector)) {
                return element.parentElement;
            }
            element = element.parentElement
        }
    }

    var selectorRules = {}

    function validate(inputElement,rule) {
        var errorMessage;
        var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector)
        
        //lay cac rule of selector
        var rules = selectorRules[rule.selector]
        //lap qua cac rule
        for(var i=0; i< rules.length; i++) {

            switch(inputElement.type) {
                case 'radio':
                case 'checkbox':
                    errorMessage = rules[i](
                        formElement.querySelector(rule.selector + ':checked')
                    );
                    break;
                default:
                    errorMessage = rules[i](inputElement.value);
            }

            if(errorMessage) break;
            
        }
        

        if(errorMessage) {
            errorElement.innerText = errorMessage;
            //gan class cho the cha of n
            getParent(inputElement, options.formGroupSelector).classList.add('invalid')
        }else{
            errorElement.innerText = '';
            //xoa class cho the cha of n
            getParent(inputElement, options.formGroupSelector).classList.remove('invalid')
        }
        return !errorMessage;
    }





    var formElement = document.querySelector(options.form)
    
    if (formElement) {
        //khi submit form
        formElement.onsubmit = function (e) {
            e.preventDefault();

            var isFormValid = true;


            options.rules.forEach(function (rule) {
                var inputElement = formElement.querySelector(rule.selector);
                var isValid = validate(inputElement, rule)
                if (!isValid) {
                    isFormValid = false;
                }
            });
            if (isFormValid) {
                //truong hop submit vs js
                if (typeof options.onSubmit === 'function') {
                    var enableInputs = formElement.querySelectorAll('[name]');
                    var formValues = Array.from(enableInputs).reduce(function(values, input) {
                        
                        switch(input.type) {
                            case 'radio':
                            case 'checkbox':
                                values[input.name] = formElement.querySelector('input[name="'+ input.name + '"]:checked').value;
                                break;
                            default:
                                values[input.name] = input.value;
                            }
                        
                        
                        return values;
                    },{});
                    options.onSubmit(formValues);
                }
                //truong hop submit vs hanh vi mac dinh
                else{
                    // formElement.submit();
                }            
            }
        }

        // duyet qua array dunf forEach()
        options.rules.forEach(function(rule) {
            //luu lai cac rule
            if (Array.isArray(selectorRules[rule.selector])){
                selectorRules[rule.selector].push(rule.test)
            }else{
                selectorRules[rule.selector] = [rule.test];
            }





            var inputElements = formElement.querySelectorAll(rule.selector);

            Array.from(inputElements).forEach(function(inputElement) {
                 //xu ly blur input
                 inputElement.onblur = function () {
                    validate(inputElement,rule);
                }
                //xu ly khi ng dung nhap vao input
                inputElement.oninput = function () {
                    var errorElement = getParent(inputElement, options.formGroupSelector).querySelector('.form-message');
                    errorElement.innerText = '';
                    //xoa class cho the cha of n
                    getParent(inputElement, options.formGroupSelector).classList.remove('invalid') 
                }
            })
        })
    }

};


// // Dinh nghia rules
// // Nguyen tac cua rules: 
// //1. Khi co loi => Tra ra mess loi
// //2. Khi hop le => Khong tra ra cai gi ca (undefined)
Validator.isRequired = function(selector, message) {
    return {
        selector: selector,
        test: function(value) {
            return value ? undefined : message || 'vui long nhap truong nay';
        }
    };
}
Validator.isEmail = function(selector, message){
    return {
        selector: selector,
        test: function(value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : message || 'Truong nay phai la email';
        }
    };
}
Validator.minLength = function(selector, min, message){
    return {
        selector: selector,
        test: function(value) {
            return value.length >= min ? undefined : message || `vui long nhap toi thieu ${min} ky tu`;
        }
    };
}
Validator.isConfirmed = function (selector, getConfirmValue, message) {
    return {
        selector: selector,
        test: function (value) {
            return value === getConfirmValue() ? undefined : message || 'Gia tri nhap vao k dung';
        }
    }
}