import moment from 'moment/moment';

export default {

    $getToday: function getToday() {
        return moment(new Date()).format('YYYYMMDD');
    },

    $getNow: function getNow() {
        return moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    },
};