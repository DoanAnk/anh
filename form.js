/****************************************************************************************************************************/
'use strict'
/****************************************************************************************************************************/


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
                //
                else{
                    // formElement.submit();
                }            
            }
        }

        //forEach()：繰り返す
        options.rules.forEach(function(rule) {
            
            //各rule保存
            if (Array.isArray(selectorRules[rule.selector])){
                selectorRules[rule.selector].push(rule.test)
            }else{
                selectorRules[rule.selector] = [rule.test];
            }

            var inputElements = formElement.querySelectorAll(rule.selector);
            Array.from(inputElements).forEach(function(inputElement) {
                
                 //ブルーするときに処理
                 inputElement.onblur = function () {
                    validate(inputElement,rule);
                }
                
                //入力するときに処理
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

Validator.isRequired = function(selector, message) {
    return {
        selector: selector,
        test: function(value) {
            return value ? undefined : message || 'ここに入力してください';
        }
    };
}
Validator.isEmail = function(selector, message){
    return {
        selector: selector,
        test: function(value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : message || 'ここにメールアドレスでないといけません';
        }
    };
}
Validator.minLength = function(selector, min, message){
    return {
        selector: selector,
        test: function(value) {
            return value.length >= min ? undefined : message || `最低 ${min}数字を入力してください`;
        }
    };
}
Validator.isConfirmed = function (selector, getConfirmValue, message) {
    return {
        selector: selector,
        test: function (value) {
            return value === getConfirmValue() ? undefined : message || 'パスワード確認を間違っています。';
        }
    }
}
