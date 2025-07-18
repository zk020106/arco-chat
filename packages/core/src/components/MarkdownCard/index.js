import MarkdownCard from './MarkdownCard.vue';
const AcMarkdownCard = MarkdownCard;
AcMarkdownCard.install = (app) => {
    app.component('AcMarkdownCard', MarkdownCard);
};
export { AcMarkdownCard };
export default AcMarkdownCard;
