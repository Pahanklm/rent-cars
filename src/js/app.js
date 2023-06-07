import * as flsFunctions from './modules/functions.js';
flsFunctions.isWebp();

import AirDatepicker from 'air-datepicker';

const selectElements = document.querySelectorAll('select');

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

let button = {
    content: 'Сьогодні',
    onClick: (dp) => {
        let date = currentDate;
        dp.selectDate(date);
        dp.setViewDate(date);
    },
};

function compareTime(time1, time2) {
    const [hours1, minutes1] = time1.split(':').map(Number);
    const [hours2, minutes2] = time2.split(':').map(Number);

    if (hours1 !== hours2) {
        return hours1 > hours2 ? -1 : 1;
    }

    if (minutes1 !== minutes2) {
        return minutes1 > minutes2 ? -1 : 1;
    }

    return 0;
}

function createOptionElement(text) {
    const optionElement = document.createElement('option');
    optionElement.textContent = text;
    return optionElement;
}

function updateSelectElements() {
    selectElements.forEach((selectElement) => {
        selectElement.innerHTML = '';

        for (
            let currentTime = new Date(startTime);
            currentTime <= endTime;
            currentTime.setMinutes(currentTime.getMinutes() + timeStep)
        ) {
            const hours = currentTime.getHours();
            const minutes = currentTime.getMinutes();
            const timeString = `${('0' + hours).slice(-2)}:${(
                '0' + minutes
            ).slice(-2)}`;

            const optionElement = createOptionElement(timeString);
            selectElement.appendChild(optionElement);
        }
    });
}

function updateErrorMessage(date1, date2, time1, time2) {
    if (date1 > date2 && date1 !== '' && date2 !== '') {
        errorMessage.textContent = 'lfksdjkfd';
    } else {
        errorMessage.textContent = '';
    }

    if (date1 === date2) {
        if (date1 === '' || date2 === '') {
            errorMessage.textContent = '';
        }
        if (compareTime(time1, time2) < 1) {
            errorMessage.textContent =
                'Время конца аренды не может быть раньше или в то же время что и начало';
        } else {
            errorMessage.textContent = '';
        }
        if (date1 !== date2) {
            errorMessage.textContent = '';
        }
    }
}

document.addEventListener('DOMContentLoaded', function () {
    updateSelectElements();

    new AirDatepicker('#airdatepicker1', {
        minDate: currentDate,
        container: 'calendar',
        disableNavWhenOutOfRange: true,
        buttons: [button, 'clear'],
        autoClose: true,
        onSelect({ date, formattedDate, datepicker }) {
            let date1 = airdatepicker1.value;
            let date2 = airdatepicker2.value;
            let time1 = selectElements[0].value;
            let time2 = selectElements[1].value;

            updateErrorMessage(date1, date2, time1, time2);
        },
        locale: {
            days: [
                'Неділя',
                'Понеділок',
                'Вівторок',
                'Середа',
                'Четвер',
                'П’ятниця',
                'Субота',
            ],
            daysShort: ['Нед', 'Пнд', 'Вів', 'Срд', 'Чтв', 'Птн', 'Сбт'],
            daysMin: ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
            months: [
                'Січень',
                'Лютий',
                'Березень',
                'Квітень',
                'Травень',
                'Червень',
                'Липень',
                'Серпень',
                'Вересень',
                'Жовтень',
                'Листопад',
                'Грудень',
            ],
            monthsShort: [
                'Січ',
                'Лют',
                'Бер',
                'Кві',
                'Тра',
                'Чер',
                'Лип',
                'Сер',
                'Вер',
                'Жов',
                'Лис',
                'Гру',
            ],
            today: 'Сьогодні',
            clear: 'Очистити',
            dateFormat: 'dd.MM.yyyy',
            timeFormat: 'HH:mm',
            firstDay: 1,
        },
    });

    new AirDatepicker('#airdatepicker2', {
        minDate: currentDate,
        disableNavWhenOutOfRange: true,
        buttons: [button, 'clear'],
        autoClose: true,
        onSelect({ date, formattedDate, datepicker }) {
            let date1 = airdatepicker1.value;
            let date2 = airdatepicker2.value;
            let time1 = selectElements[0].value;
            let time2 = selectElements[1].value;

            updateErrorMessage(date1, date2, time1, time2);
        },
        locale: {
            days: [
                'Неділя',
                'Понеділок',
                'Вівторок',
                'Середа',
                'Четвер',
                'П’ятниця',
                'Субота',
            ],
            daysShort: ['Нед', 'Пнд', 'Вів', 'Срд', 'Чтв', 'Птн', 'Сбт'],
            daysMin: ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
            months: [
                'Січень',
                'Лютий',
                'Березень',
                'Квітень',
                'Травень',
                'Червень',
                'Липень',
                'Серпень',
                'Вересень',
                'Жовтень',
                'Листопад',
                'Грудень',
            ],
            monthsShort: [
                'Січ',
                'Лют',
                'Бер',
                'Кві',
                'Тра',
                'Чер',
                'Лип',
                'Сер',
                'Вер',
                'Жов',
                'Лис',
                'Гру',
            ],
            today: 'Сьогодні',
            clear: 'Очистити',
            dateFormat: 'dd.MM.yyyy',
            timeFormat: 'HH:mm',
            firstDay: 1,
        },
    });
});

selectElements.forEach(function (selectElement) {
    selectElement.addEventListener('change', function () {
        let date1 = airdatepicker1.value;
        let date2 = airdatepicker2.value;
        let time1 = selectElements[0].value;
        let time2 = selectElements[1].value;

        updateErrorMessage(date1, date2, time1, time2);
    });
});
