import * as flsFunctions from './modules/functions.js';

flsFunctions.isWebp();

const selectElements = document.querySelectorAll('select');
const date1Input = document.querySelector('.data1');
const date2Input = document.querySelector('.data2');
const form = document.querySelector('.calendar__form');
const currentDate = new Date();
const errorMessage = document.createElement('span');
errorMessage.classList.add('error-message');
form.insertAdjacentElement('afterend', errorMessage);

const startTime = new Date();
startTime.setHours(9);
startTime.setMinutes(0);

const endTime = new Date();
endTime.setHours(23);
endTime.setMinutes(59);

const timeStep = 30;

function compareTime(time1, time2) {
    const [hours1, minutes1] = time1.split(':').map(Number);
    const [hours2, minutes2] = time2.split(':').map(Number);

    return hours1 > hours2
        ? -1
        : hours1 < hours2
        ? 1
        : minutes1 > minutes2
        ? -1
        : minutes1 < minutes2
        ? 1
        : 0;
}

function checkDate(date1, date2) {
    if (date2.getTime() === date1.getTime()) {
        let time1 = selectElements[0].value;
        let time2 = selectElements[1].value;
        if (compareTime(time1, time2) < 1) {
            errorMessage.textContent =
                'Время конца аренды не может быть раньше или в то же время что и начало';
        } else {
            errorMessage.textContent = '';
        }
    }
}

selectElements.forEach((selectElement) => {
    selectElement.innerHTML = '';

    for (
        let currentTime = new Date(startTime);
        currentTime <= endTime;
        currentTime.setMinutes(currentTime.getMinutes() + timeStep)
    ) {
        const hours = currentTime.getHours();
        const minutes = currentTime.getMinutes();

        const timeString = `${('0' + hours).slice(-2)}:${('0' + minutes).slice(
            -2
        )}`;

        const optionElement = document.createElement('option');
        optionElement.innerHTML = timeString;
        selectElement.appendChild(optionElement);
    }
});

date1Input.value = currentDate.toISOString().slice(0, 10);

const inputs = [date1Input, date2Input];
inputs.forEach(function (input) {
    input.addEventListener('change', function () {
        let date1 = new Date(date1Input.value);
        let date2 = new Date(date2Input.value);
        let getDay = date1.getTime();
        let today = currentDate.getTime();

        if (getDay < today - 99999999) {
            errorMessage.textContent =
                'дата подачи не может быть раньше чем сегодня';
            date1Input.value = '';
        } else {
            errorMessage.textContent = '';
        }

        checkDate(date1, date2);
        if (date1 > date2) {
            errorMessage.textContent =
                'дата подачи не может быть позже чем дата возврата';
            date2Input.value = '';
        }
    });
});

selectElements.forEach(function (selectElement) {
    selectElement.addEventListener('change', function () {
        let date1 = new Date(date1Input.value);
        let date2 = new Date(date2Input.value);
        checkDate(date1, date2);
    });
});
