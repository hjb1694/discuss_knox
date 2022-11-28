<template>
    <div class="container">
        <div class="rules">
            <h2>Platform Rules</h2>
            <div class="briefing">
                <p>
                    Knox Discuss, along with Ktown Portal's other platforms, strive to foster and maintain a safe, healthy environment 
                    for its users, whether that be registered members, its staff and administrators, or visitors stopping by. As such, Knox Discuss has established 
                    rules and regulations that its users must adhere to at all times. Please keep in mind these rules and regulations 
                    can be amended at any time as needed to ensure our mission to keep the website safe, secure, and a positive user experience for all.
                </p>
            </div>
            <ol>
                <li>
                    For the safety of minors, any use of this website is restricted to those ages thirteen (13) or older. Misrepresentation of age will be grounds for 
                    immediate termination/deactivation of the user's account.
                </li>
                <li>
                    Users must be civil and respectful of other users while contributing to the content of this website. "Contributing of content" includes, but is 
                    not limited to, the adding of any threads, opinions, opinion replies, profile content, and/or private chat messages. Personal attacks, threatening language or behavior, 
                    harassment, cyberbullying, cyberstalking, and/or any disparaging behavior of individuals or groups based on sex, age, race, ethnicity, disability, sexual orientation, creed, or
                    religion (or lack of thereof) will not be tolerated.
                </li>
                <li>
                    Content that is sexually explicit, promotes violence, promotes substance abuse, or promotes illegal activities is not allowed.
                </li>
                <li>
                    While our filters try to eliminate profane language, they are not perfect. Users must keep their language appropriate to all users.
                </li>
                <li>
                    Advertising or soliciting is not allowed, unless approved by the admin and is paid for. Users may discuss businesses that are relative to Knoxville and immediately surrounding areas,
                    but postings that are deemed advertising at the discretion of the admin will be removed.
                </li>
                <li>
                    Duplicate postings or postings that are very closely related (for example, postings that have been slightly modified but closely resembles another posting) are not allowed.
                </li>
                <li>
                    Spam or content that is irrelevant and/or nonsensical is not allowed.
                </li>
                <li>
                    Enticing or encouraging minors (under 18) to engage in immoral, unethical, or illegal acts is strictly prohibited.
                </li>
                <li>
                    When posting content, users must also adhere to the channel's rules and regulations in addition to the overall platform's rules and regulations. 
                </li>
                <li>
                    Content that promotes injurious behaviors or is indicative of harming behaviors, also including self-harm, will be removed. If you are having thoughts
                    or urges to harm yourself or others, please seek immediate help, speak with a trusted professional, or if it is safe to do so, go to the nearest emergency room. 
                </li>
                <li>
                    Accounts or content that is used to scam, deceive other users, and/or provide links to malicious websites is strictly prohibited.
                </li>
            </ol>
            <div class="conclusion">
                <p>
                    Failure to abide by these rules may result in the hiding and/or removal of content, deduction of any points earned, and depending on the 
                    severity of the violation or if there are recurring violations, the deactivation of the offending user's account. Ktown Portal and Knox Discuss 
                    will cooperate in any lawful investigations pertaining to illegal activities involving this platform and/or related platforms. Behaviors that endanger 
                    the safety and welfare of any user, also including oneself, will be reported to the appropriate law enforcement authorities when appropriate.
                </p>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .container{
        width:75%;
        padding:1rem;
        margin:2rem auto;
    }

    .rules{
        background:#fff;
        padding:1rem;
        font-size:1.4rem;
        border:1px solid #ccc;

        h2, 
        .briefing{
            margin-bottom:1rem;
        }

        ol{
            list-style-position: inside;
            margin-bottom:1rem;

            li{
                margin-bottom:1rem;
            }
        }
    }

    @media (max-width: 800px) {
        .container{
        width:100%;
        }
    }

</style>