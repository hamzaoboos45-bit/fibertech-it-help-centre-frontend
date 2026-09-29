import IssueBrowser from "../../../components/IssueBrowser";

export default function SubcategoryPage() {
    return <IssueBrowser categorySlug="security" subcategorySlug="password-issues" routeSubcategorySlug="password" backLabel="Back to Security & Access" />;
}
