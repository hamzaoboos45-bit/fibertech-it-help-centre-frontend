import IssueBrowser from "../../../components/IssueBrowser";

export default function SubcategoryPage() {
    return <IssueBrowser categorySlug="security" subcategorySlug="access-permissions" routeSubcategorySlug="permissions" backLabel="Back to Security & Access" />;
}
