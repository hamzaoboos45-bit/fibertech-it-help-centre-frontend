import IssueBrowser from "../../../components/IssueBrowser";

export default function SubcategoryPage() {
    return (
        <IssueBrowser
            categorySlug="security"
            subcategorySlug="mfa"
            routeSubcategorySlug="mfa"
            backLabel="Back to Security & Access"
        />
    );
}