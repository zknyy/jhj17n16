package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Entry;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;

public interface EntryRepositoryWithBagRelationships {
    Optional<Entry> fetchBagRelationships(Optional<Entry> entry);

    List<Entry> fetchBagRelationships(List<Entry> entries);

    Page<Entry> fetchBagRelationships(Page<Entry> entries);
}
