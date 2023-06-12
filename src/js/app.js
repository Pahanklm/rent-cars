import * as flsFunctions from './modules/functions.js';
flsFunctions.isWebp();
import AirDatepicker from 'air-datepicker';
import Choices from 'choices.js';
import axios, { isCancel, AxiosError } from 'axios';

const form = document.querySelector('.calendar__form');
const selectElement1 = document.querySelector('.calendar__select1');
const selectElement2 = document.querySelector('.calendar__select2');
const calendarBtn = document.querySelector('.calendar__btn');
const selectElements = [selectElement1, selectElement2];
const currentDate = new Date();
const day = currentDate.getDate();
const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
const year = currentDate.getFullYear();
const successMessage = document.createElement('span');
successMessage.classList.add('success-message');
form.insertAdjacentElement('beforeend', successMessage);
const errorMessage = document.createElement('span');
errorMessage.classList.add('error-message');
form.insertAdjacentElement('beforeend', errorMessage);
const today = `${day}.${month}.${year}`;

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

function addTimeOptions(isSelectElement2 = false) {
    let date1 = airdatepicker1.value;
    const currentTime = new Date();
    let startTime;

    if (date1 === today) {
        startTime = new Date(
            Math.ceil(currentTime.getTime() / (30 * 60 * 1000)) *
                (30 * 60 * 1000)
        );
    }
    if (date1 !== today) {
        startTime = new Date();
        startTime.setHours(9, 0, 0, 0);
    }
    const endTime = new Date(currentTime);
    endTime.setHours(23, 59, 0);

    const timeOptions = [];
    let startIndex = isSelectElement2 ? 0 : 1; // Начальный индекс

    while (startTime <= endTime) {
        const optionText = startTime.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
        });
        const optionValue = startTime.toISOString();

        if (startIndex >= 1) {
            timeOptions.push({ label: optionText, value: optionValue });
        }

        startTime.setTime(startTime.getTime() + 30 * 60 * 1000);
        startIndex++;
    }

    return timeOptions;
}

function updateErrorMessage(date1, date2, time1, time2) {
    if (date1 > date2 && date1 !== '' && date2 !== '') {
        errorMessage.textContent =
            'Дата подачі не може бути пізніше аніж дата повернення';
        airdatepicker2.value = '';
    } else if (date1 === date2 && date1 !== '' && date2 !== '') {
        if (compareTime(time1, time2) < 1) {
            errorMessage.textContent =
                'Час повернення не може бути раніше або в той самий час, що й початок';
        } else {
            errorMessage.textContent = '';
        }
    } else {
        errorMessage.textContent = '';
    }
}

function updateCalendarButton() {
    const date1 = airdatepicker1.value;
    const date2 = airdatepicker2.value;

    if (date1 === '' || date2 === '' || errorMessage.textContent !== '') {
        calendarBtn.disabled = true;
    } else {
        calendarBtn.disabled = false;
    }
}

selectElements.forEach(function (selectElement) {
    selectElement.addEventListener('change', function () {
        const date1 = airdatepicker1.value;
        const date2 = airdatepicker2.value;
        const time1 = selectElement1.textContent;
        const time2 = selectElement2.textContent;

        updateErrorMessage(date1, date2, time1, time2);
        updateCalendarButton();
    });
});

document.addEventListener('DOMContentLoaded', function () {
    let airdatepicker1 = document.querySelector('#airdatepicker1');
    let airdatepicker2 = document.querySelector('#airdatepicker2');

    airdatepicker1.value = today;
    airdatepicker2.value = today;

    const datePicker1 = new AirDatepicker(airdatepicker1, {
        minDate: currentDate,
        container: 'calendar',
        disableNavWhenOutOfRange: true,
        buttons: [button, 'clear'],
        autoClose: true,
        onSelect({ date }) {
            const selectedDate = new Date(date.getTime());
            datePicker2.update({
                minDate: selectedDate,
            });
            const date1 = airdatepicker1.value;
            const date2 = airdatepicker2.value;
            const time1 = selectElement1.textContent;
            const time2 = selectElement2.textContent;

            updateErrorMessage(date1, date2, time1, time2);
            updateCalendarButton();
            destroyChoices();
            createChoices();
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

    const datePicker2 = new AirDatepicker(airdatepicker2, {
        minDate: currentDate,
        disableNavWhenOutOfRange: true,
        buttons: [button, 'clear'],
        autoClose: true,
        onSelect({ date }) {
            const date1 = airdatepicker1.value;
            const date2 = airdatepicker2.value;
            const time1 = selectElement1.textContent;
            const time2 = selectElement2.textContent;

            updateErrorMessage(date1, date2, time1, time2);
            updateCalendarButton();
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

    function destroyChoices() {
        if (selectElement1.choices) {
            selectElement1.choices.destroy();
        }
        if (selectElement2.choices) {
            selectElement2.choices.destroy();
        }
    }

    function createChoices() {
        selectElement1.choices = new Choices(selectElement1, {
            searchEnabled: false,
            shouldSort: false,
            itemSelectText: '',
            choices: addTimeOptions(),
            allowHTML: true,
            position: 'bottom',
        });
        selectElement2.choices = new Choices(selectElement2, {
            searchEnabled: false,
            shouldSort: false,
            itemSelectText: '',
            choices: addTimeOptions(true),
            allowHTML: true,
            position: 'bottom',
        });
    }

    createChoices();

    updateCalendarButton();
    const token = '5770583680:AAEkwsJeKLgu8LpdjRBlyb-K2CaUSnS69yM';
    const chat_id = '-1001924586292';
    const url_api = `https://api.telegram.org/bot${token}/sendMessage`;
    const tg = document.getElementById('tg');

    tg.addEventListener('submit', function (e) {
        e.preventDefault();
        let message = '<b> Заявка с сайта </b>\n';
        message += `Хочу тачку\nс ${this.airdatepicker1.value} ${this.fromTime.textContent}\n`;
        message += `по ${this.airdatepicker2.value} ${this.toTime.textContent}`;

        axios
            .post(url_api, {
                chat_id: chat_id,
                parse_mode: 'html',
                text: message,
            })
            .then((response) => {
                const btn = document.querySelector('.calendar__btn');
                airdatepicker1.value = '';
                airdatepicker2.value = '';
                updateCalendarButton();
                errorMessage.textContent = '';
                successMessage.textContent =
                    'наш менеджер скоро с вами свяжется';
            })
            .catch((error) => {
                successMessage.textContent = '';
                errorMessage.textContent =
                    'не удалось отправить данный, попробуйте снова';
            });
    });
});
