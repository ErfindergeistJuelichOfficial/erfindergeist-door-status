<?php

if ( ! defined( 'ABSPATH' ) ) {
  exit;
}

require_once 'vars.php';

function custom_content_after_body_open_tag() {

    ?>

    <div>My Custom Content</div>

    <?php

}

add_action('wp_body_open', 'custom_content_after_body_open_tag');

/**
 * Appends the authors initials to the content.
 * Mimics paper magazines that have a trailing short to show the end of the article.
 * Gets appended at the end inside the last paragraph.
 * @param (string) $content
 * @return (string) $content
 */
// function wpse28904_append_to_content( $content )
// {
//   // Only do it for specific templates
//   if ( !is_page() ) {
//     return $content;
//   }
      

//     // Get author initials
//     $author = '';
//     preg_match_all( '/[A-Z]/', get_the_author(), $initials_arr );
//     foreach ( $initials_arr[0] as $initials )
//         $author .= $initials;
//     $author_url     = get_the_author_meta('url');
//     if ( $author_url )
//     {
//         $title  = esc_attr( sprintf(__("Visit %s&#8217;s website"), $author ) );
//         $author = "<a href='{$author_url}' title='{$title}' rel='external'>{$author}</a>";
//     }

//     // Append  author initials to end of article
//     $content  = preg_replace( "/<p[^>]*><\\/p[^>]*>/", '', $content );
//     $position = strrpos( $content, '</p>' );
//     $content  = substr_replace( $content, "<sub>{$author}</sub>", $position, -1 );

//     // add something like the adminbar to content
//     return $content;
// }
// add_filter( 'the_content', 'wpse28904_append_to_content' );